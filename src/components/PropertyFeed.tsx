"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';
import PropertyCard from '@/components/PropertyCard';

// Reuse amenityIconMap from page.tsx
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
  Furniture: 'chair',
  'Attached Bath': 'bathtub',
  'Water Supply': 'water_drop',
  Geyser: 'heat_pump',
  'Backup Power': 'battery_charging_full',
  'Washing Machine': 'local_laundry_service',
  'Pet Friendly': 'pets',
};

// --- Skeleton ---
function PropertyCardSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className={`rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/20 animate-pulse ${wide ? 'lg:col-span-2 flex flex-col md:flex-row' : 'flex flex-col'}`}>
      <div className={`${wide ? 'md:w-2/5 h-56 md:h-auto' : 'h-56 w-full'} bg-surface-container`} />
      <div className="p-6 flex-1 space-y-4">
        <div className="h-6 w-3/4 bg-surface-container rounded" />
        <div className="h-4 w-1/2 bg-surface-container rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-28 bg-surface-container rounded-lg" />
          <div className="h-8 w-28 bg-surface-container rounded-lg" />
        </div>
        <div className="h-10 w-full bg-surface-container rounded mt-auto" />
      </div>
    </div>
  );
}

interface PropertyFeedProps {
  initialProperties: any[];
  initialHasMore: boolean;
  initialSavedPgIds: string[];
}

export default function PropertyFeed({ initialProperties, initialHasMore, initialSavedPgIds }: PropertyFeedProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [properties, setProperties] = useState<any[]>(initialProperties);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [savedPgIds, setSavedPgIds] = useState<Set<string>>(new Set(initialSavedPgIds));
  const [isSavingMap, setIsSavingMap] = useState<Record<string, boolean>>({});

  // Reset state when searchParams change (since they are passed to the server component initially)
  useEffect(() => {
    setProperties(initialProperties);
    setHasMore(initialHasMore);
    setPage(1);
  }, [searchParams, initialProperties, initialHasMore]);

  const { ref, inView } = useInView({
    rootMargin: "500px",
  });

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', nextPage.toString());
      params.set('limit', '6');

      const res = await fetch(`/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch more properties');
      const data = await res.json();

      setProperties(prev => [...prev, ...(data.properties || [])]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load more properties');
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page, searchParams]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  // Track view when a property card is clicked
  const trackView = (propertyId: string) => {
    fetch(`/api/properties/${propertyId}/view`, { method: 'POST' }).catch(() => { });
  };

  const handleSaveClick = async (e: React.MouseEvent, pgId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error('Please sign in to save PGs!');
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isSavingMap[pgId]) return;

    setIsSavingMap(prev => ({ ...prev, [pgId]: true }));
    const isSaved = savedPgIds.has(pgId);

    try {
      if (isSaved) {
        const res = await fetch('/api/users/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pgId })
        });
        if (res.ok) {
          setSavedPgIds(prev => {
            const next = new Set(prev);
            next.delete(pgId);
            return next;
          });
          toast.success('Removed from Favorites!');
        } else {
          toast.error('Failed to remove from favorites');
        }
      } else {
        const res = await fetch('/api/users/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pgId })
        });
        if (res.ok) {
          setSavedPgIds(prev => {
            const next = new Set(prev);
            next.add(pgId);
            return next;
          });
          toast.success('Added to Favorites!');
        } else {
          toast.error('Failed to save');
        }
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsSavingMap(prev => ({ ...prev, [pgId]: false }));
    }
  };

  const handleBookClick = async (e: React.MouseEvent, pgId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error('Please sign in to book a visit!');
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isSavingMap[`book_${pgId}`]) return;
    setIsSavingMap(prev => ({ ...prev, [`book_${pgId}`]: true }));

    try {
      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() + 1);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pgId,
          message: "I am interested in visiting this PG.",
          visitDate: visitDate.toISOString()
        })
      });
      const data = await res.json();
      if (res.ok || res.status === 201) {
        toast.success('Visit requested successfully!');
      } else {
        toast.error(data.error || 'Failed to request visit');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsSavingMap(prev => ({ ...prev, [`book_${pgId}`]: false }));
    }
  };

  // Sorting Handler
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1');
    router.push(`/pgs?${params.toString()}`);
  };

  // Search Handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('search', e.target.value);
    } else {
      params.delete('search');
    }
    // We only want to search on blur or Enter to avoid rapid re-renders on the server, but for simplicity we push here.
    // Wait, replacing URL on every keystroke is bad. We should keep local state and only push on submit/blur.
  };

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const submitSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/pgs?${params.toString()}`);
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitSearch();
    }
  };

  const sortOption = searchParams.get('sort') || 'popular';

  return (
    <div className="flex-grow flex flex-col">
      {/* Mobile Filter Toggle & Sorting Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-stack-md gap-4">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface">Available PGs in Kothri</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Showing {properties.length} properties
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Search Bar with Integrated Filter */}
          <div className="flex items-center bg-surface-container-high rounded-full px-4 py-2 w-full sm:w-80 border border-outline-variant/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-md flex-grow text-on-surface outline-none"
              placeholder="Search Kothri..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onBlur={submitSearch}
            />
            <button className="md:hidden ml-2 p-1.5 bg-surface rounded-full text-on-surface-variant shadow-sm border border-outline-variant flex items-center justify-center cursor-pointer hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">tune</span>
            </button>
          </div>

          <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full appearance-none bg-surface border border-outline text-on-surface-variant py-2 pl-4 pr-10 rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer h-[42px]"
            >
              <option value="popular">Sort by: Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="closest">Closest to Campus</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-[9px] text-on-surface-variant pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-stack-md">
        {properties.length > 0 ? (
          properties.map((property, index) => {
            // Make every 3rd card a wide card
            const isWide = index > 0 && (index + 1) % 3 === 0;

            if (isWide) {
              return (
                <Link
                  key={property._id}
                  href={`/pgs/${property._id}`}
                  onClick={() => trackView(property._id)}
                  className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(76,29,149,0.05)] hover:shadow-[0px_8px_30px_rgba(76,29,149,0.15)] transition-shadow duration-300 border border-outline-variant/20 flex flex-col relative col-span-2 cursor-pointer block"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5 h-[120px] md:h-auto relative overflow-hidden bg-surface-variant flex">
                      <div className="absolute top-3 right-3 z-20 flex gap-2">
                        <button 
                          onClick={(e) => handleSaveClick(e, property._id)}
                          disabled={isSavingMap[property._id]}
                          className={`bg-surface/80 backdrop-blur-sm p-1.5 rounded-full shadow-md transition-colors flex items-center justify-center cursor-pointer disabled:opacity-70 ${savedPgIds.has(property._id) ? 'text-secondary' : 'text-on-surface hover:text-secondary'}`}
                        >
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: savedPgIds.has(property._id) ? "'FILL' 1" : "'FILL' 0" }}>
                            {savedPgIds.has(property._id) ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>
                      </div>
                      
                      {/* First Image */}
                      <div className={`relative h-full ${property.images?.length > 1 ? 'w-1/2 md:w-full' : 'w-full'} flex-grow`}>
                        <Image
                          alt={property.title}
                          fill
                          priority={index === 0}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          src={property.images?.[0] || '/placeholder.jpg'}
                        />
                      </div>
                      
                      {/* Second Image (Mobile only, if available) */}
                      {property.images?.length > 1 && (
                        <div className="relative h-full w-1/2 md:hidden border-l-2 border-surface-container-lowest">
                          <Image
                            alt={`${property.title} view 2`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            src={property.images[1]}
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-2 md:p-6 flex flex-col flex-grow md:w-3/5">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 md:mb-2 md:gap-2">
                        <div className="w-full">
                          <h3 className="font-semibold text-sm md:font-h2 md:text-h2 text-on-surface group-hover:text-primary transition-colors">{property.title}</h3>

                          {/* Mobile-only Price (Stacked under title) */}
                          <div className="text-left md:hidden mt-0.5 flex items-end gap-0.5">
                            <span className="text-sm text-primary font-bold">
                              ₹{property.price?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-normal leading-4">/mo</span>
                          </div>

                          <div className="flex items-center gap-0.5 md:gap-1 text-on-surface-variant w-full overflow-hidden mt-1">
                            <span className="material-symbols-outlined text-[12px] md:text-[18px] flex-shrink-0">location_on</span>
                            <p className="text-[10px] md:font-body-md md:text-body-md line-clamp-1 m-0">
                              {property.location?.address}
                            </p>
                          </div>
                        </div>
                        {property.roomTypes?.length > 0 && (
                          <div className="hidden md:block bg-surface-container-high text-primary px-2 py-1 rounded font-label-sm text-label-sm mt-2 md:mt-0">
                            {property.roomTypes[0]}
                          </div>
                        )}
                      </div>
                      <p className="hidden md:block font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-stack-md mt-2">
                        {property.description}
                      </p>
                      <div className="hidden md:flex flex-wrap gap-2 mb-stack-md mt-auto">
                        {(() => {
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
                            .filter(a => (property as any)[a.key])
                            .map(a => a.label);
                          const uniqueAmenities = Array.from(new Set([...(property.amenities || []), ...activeBooleans]));

                          return (
                            <>
                              {uniqueAmenities.slice(0, 4).map((amenity) => (
                                <div key={amenity} className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10 whitespace-nowrap">
                                  <span className="material-symbols-outlined text-[16px]">{amenityIconMap[amenity] || 'check_circle'}</span>
                                  {amenity}
                                </div>
                              ))}
                              {uniqueAmenities.length > 4 && (
                                <div className="bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center border border-outline-variant/30 whitespace-nowrap">
                                  +{uniqueAmenities.length - 4} more
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      <div className="hidden md:flex mt-auto pt-4 border-t border-outline-variant/30 justify-between items-end">
                        <div>
                          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Starting from</p>
                          <p className="font-h2 text-h2 text-primary font-bold">
                            ₹{property.price?.toLocaleString('en-IN')}
                            <span className="font-body-md text-body-md font-normal text-on-surface-variant">/mo</span>
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button className="bg-surface text-primary border border-primary px-4 py-2.5 rounded-lg font-body-md text-body-md font-semibold hover:bg-primary/5 transition-colors hidden sm:block cursor-pointer">
                            View Details
                          </button>
                          <button
                            onClick={(e) => handleBookClick(e, property._id)}
                            disabled={isSavingMap[`book_${property._id}`]}
                            className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-body-md text-body-md font-semibold hover:bg-on-secondary-fixed-variant transition-colors shadow-sm cursor-pointer disabled:opacity-70"
                          >
                            {isSavingMap[`book_${property._id}`] ? 'Booking...' : 'Book Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <PropertyCard
                key={property._id}
                property={property}
                initialIsSaved={savedPgIds.has(property._id)}
                onSaveToggle={(pgId, isSaved) => {
                  setSavedPgIds(prev => {
                    const next = new Set(prev);
                    if (isSaved) next.add(pgId);
                    else next.delete(pgId);
                    return next;
                  });
                }}
                priority={index === 0}
                onClick={() => trackView(property._id)}
              />
            );
          })
        ) : (
          <div className="md:col-span-2 bg-surface-container rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">search_off</span>
            <h3 className="font-h2 text-h2 text-on-surface mb-2">No properties found</h3>
            <p className="font-body-lg text-on-surface-variant">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={ref} className="mt-stack-lg flex justify-center py-8">
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </div>
      )}
    </div>
  );
}
