"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// --- Types ---
interface PropertyLocation {
  address: string;
  city: string;
  state: string;
}

interface PropertyData {
  _id: string;
  title: string;
  description: string;
  location: PropertyLocation;
  price: number;
  images: string[];
  status: string;
  amenities: string[];
  roomTypes: string[];
  views: number;
}

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

export default function PgsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PgsContent />
    </Suspense>
  );
}

function PgsContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState<string>(searchParams.get('priceRange') || 'any'); // 'any', 'under_5k', '5k_8k', '8k_12k', 'above_12k'
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('popular');

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProperties = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      if (priceRange === 'under_5k') {
        params.append('maxPrice', '5000');
      } else if (priceRange === '5k_8k') {
        params.append('minPrice', '5000');
        params.append('maxPrice', '8000');
      } else if (priceRange === '8k_12k') {
        params.append('minPrice', '8000');
        params.append('maxPrice', '12000');
      } else if (priceRange === 'above_12k') {
        params.append('minPrice', '12000');
      }

      if (selectedAmenities.length > 0) {
        params.append('amenities', selectedAmenities.join(','));
      }
      
      if (sortOption) {
        params.append('sort', sortOption);
      }

      params.append('page', pageNum.toString());
      params.append('limit', '6');

      const res = await fetch(`/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch properties');
      const data = await res.json();
      
      if (pageNum === 1) {
        setProperties(data.properties || []);
      } else {
        setProperties(prev => [...prev, ...(data.properties || [])]);
      }
      setHasMore(data.hasMore);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProperties(1);
  }, [sortOption]); // Re-fetch when sort changes

  const handleApplyFilters = () => {
    setPage(1);
    fetchProperties(1);
  };

  const handleClearFilters = () => {
    setPriceRange('any');
    setSelectedAmenities([]);
    setSearchQuery('');
    setSortOption('popular');
    setPage(1);
    // We will let the state update first, then fetch
    setTimeout(() => {
      fetchProperties(1);
    }, 0);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchProperties(1);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProperties(nextPage);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Track view when a property card is clicked
  const trackView = (propertyId: string) => {
    fetch(`/api/properties/${propertyId}/view`, { method: 'POST' }).catch(() => {});
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="w-full sticky top-0 z-40 bg-surface dark:bg-on-background shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
          <span className="font-display text-h2 font-extrabold text-primary dark:text-primary-fixed-dim cursor-default">
            PG Genie
          </span>
          <div className="hidden md:flex items-center gap-6">
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10 transition-colors h-16 flex items-center px-4 rounded" href="/">Home</Link>
            <Link className="font-body-md text-body-md text-primary dark:text-primary-fixed-dim font-bold border-b-2 border-primary h-16 flex items-center" href="/pgs">Search</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10 transition-colors h-16 flex items-center px-4 rounded" href="/dashboard">Saved</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10 transition-colors h-16 flex items-center px-4 rounded" href="/dashboard/profile">Profile</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-surface-container-high rounded-full px-4 py-2 items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-body-md w-48 text-on-surface outline-none" 
                placeholder="Search Kothri..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
            <button className="p-2 text-primary dark:text-primary-fixed-dim hover:bg-primary-container/10 transition-colors rounded-full cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link href="/login" className="p-2 text-primary dark:text-primary-fixed-dim hover:bg-primary-container/10 transition-colors rounded-full cursor-pointer">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-lg flex flex-col md:flex-row gap-stack-lg">
        {/* Left Sidebar: Filters */}
        <aside className="w-full md:w-72 flex-shrink-0 space-y-stack-md hidden md:block">
          <div className="bg-surface-container-low rounded-xl p-6 shadow-sm border border-outline-variant/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-h2 text-h2 text-on-surface">Filters</h2>
              <button onClick={handleClearFilters} className="text-primary font-body-md text-body-md hover:underline cursor-pointer">Clear all</button>
            </div>

            {/* Price Range */}
            <div className="mb-stack-md">
              <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Price Range (Monthly)</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={priceRange === 'any'} onChange={() => setPriceRange('any')} className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
                  <span className="font-body-md text-body-md text-on-surface-variant">Any Price</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={priceRange === 'under_5k'} onChange={() => setPriceRange('under_5k')} className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
                  <span className="font-body-md text-body-md text-on-surface-variant">Under ₹5,000</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={priceRange === '5k_8k'} onChange={() => setPriceRange('5k_8k')} className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
                  <span className="font-body-md text-body-md text-on-surface-variant">₹5,000 - ₹8,000</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={priceRange === '8k_12k'} onChange={() => setPriceRange('8k_12k')} className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
                  <span className="font-body-md text-body-md text-on-surface-variant">₹8,000 - ₹12,000</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={priceRange === 'above_12k'} onChange={() => setPriceRange('above_12k')} className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
                  <span className="font-body-md text-body-md text-on-surface-variant">Above ₹12,000</span>
                </label>
              </div>
            </div>

            <hr className="border-outline-variant/50 mb-stack-md" />

            {/* Gender */}
            <div className="mb-stack-md">
              <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Gender Focus</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-full border border-primary bg-primary-container/10 text-primary font-body-md text-body-md cursor-pointer">Boys</button>
                <button className="px-4 py-2 rounded-full border border-outline bg-surface text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors cursor-pointer">Girls</button>
                <button className="px-4 py-2 rounded-full border border-outline bg-surface text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors cursor-pointer">Co-ed</button>
              </div>
            </div>

            <hr className="border-outline-variant/50 mb-stack-md" />

            {/* Facilities */}
            <div className="mb-stack-md">
              <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Facilities</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('WiFi')} onChange={() => toggleAmenity('WiFi')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">wifi</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">High-Speed WiFi</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('AC')} onChange={() => toggleAmenity('AC')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">ac_unit</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Air Conditioning</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('Meals')} onChange={() => toggleAmenity('Meals')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">restaurant</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Meals Included</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('Laundry')} onChange={() => toggleAmenity('Laundry')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">local_laundry_service</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Laundry</span>
                </label>
              </div>
            </div>

            <hr className="border-outline-variant/50 mb-stack-md" />

            {/* Distance from VIT */}
            <div className="mb-stack-md">
              <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Distance from VIT</h3>
              <input className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" max="10" min="0" type="range" defaultValue="3" />
              <div className="flex justify-between mt-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">0 km</span>
                <span className="font-label-sm text-label-sm text-primary">Up to 3 km</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">10+ km</span>
              </div>
            </div>

            <button onClick={handleApplyFilters} className="w-full bg-primary text-on-primary py-3 rounded-lg font-body-lg text-body-lg font-semibold hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Right Content Area: Listings */}
        <div className="flex-grow flex flex-col">
          {/* Mobile Filter Toggle & Sorting Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-stack-md gap-4">
            <div>
              <h1 className="font-h1 text-h1 text-on-surface">Available PGs in Kothri</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                {loading ? 'Loading properties...' : `Showing ${properties.length} properties`}
              </p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button className="md:hidden flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-outline rounded-lg bg-surface text-on-surface-variant font-body-md text-body-md cursor-pointer">
                <span className="material-symbols-outlined">tune</span>
                Filters
              </button>
              <div className="relative flex-1 sm:flex-none">
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full appearance-none bg-surface border border-outline text-on-surface-variant py-2 pl-4 pr-10 rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                >
                  <option value="popular">Sort by: Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="closest">Closest to Campus</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-error-container text-on-error-container p-6 rounded-xl mb-stack-md flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              <p>{error}</p>
            </div>
          )}

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-stack-md">
            {loading ? (
              <>
                <PropertyCardSkeleton />
                <PropertyCardSkeleton />
                <PropertyCardSkeleton wide />
              </>
            ) : properties.length > 0 ? (
              properties.map((property, index) => {
                // Make every 3rd card a wide card (like the original design)
                const isWide = index > 0 && (index + 1) % 3 === 0;

                if (isWide) {
                  return (
                    <Link
                      key={property._id}
                      href={`/pgs/${property._id}`}
                      onClick={() => trackView(property._id)}
                      className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(76,29,149,0.05)] hover:shadow-[0px_8px_30px_rgba(76,29,149,0.15)] transition-shadow duration-300 border border-outline-variant/20 flex flex-col relative lg:col-span-2 cursor-pointer block"
                    >
                      <div className="flex flex-col md:flex-row h-full">
                        <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                          <div className="absolute top-4 right-4 z-10 bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-md">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                          </div>
                          <img
                            alt={property.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            src={property.images?.[0] || '/placeholder.jpg'}
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-grow md:w-3/5">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-h2 text-h2 text-on-surface group-hover:text-primary transition-colors">{property.title}</h3>
                              <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                {property.location?.address}
                              </p>
                            </div>
                            {property.roomTypes?.length > 0 && (
                              <div className="bg-surface-container-high text-primary px-2 py-1 rounded font-label-sm text-label-sm">
                                {property.roomTypes[0]}
                              </div>
                            )}
                          </div>
                          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-stack-md mt-2">
                            {property.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-stack-md">
                            {property.amenities?.slice(0, 4).map((amenity) => (
                              <div key={amenity} className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                                <span className="material-symbols-outlined text-[16px]">{amenityIconMap[amenity] || 'check_circle'}</span>
                                {amenity}
                              </div>
                            ))}
                          </div>
                          <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-end">
                            <div>
                              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Starting from</p>
                              <p className="font-h2 text-h2 text-primary font-bold">
                                ₹{property.price?.toLocaleString('en-IN')}
                                <span className="font-body-md text-body-md font-normal text-on-surface-variant">/mo</span>
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <button className="bg-surface text-primary border border-primary px-4 py-2.5 rounded-lg font-body-md text-body-md font-semibold hover:bg-primary/5 transition-colors hidden sm:block cursor-pointer">
                                View Map
                              </button>
                              <button className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-body-md text-body-md font-semibold hover:bg-on-secondary-fixed-variant transition-colors shadow-sm cursor-pointer">
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={property._id}
                    href={`/pgs/${property._id}`}
                    onClick={() => trackView(property._id)}
                    className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(76,29,149,0.05)] hover:shadow-[0px_8px_30px_rgba(76,29,149,0.15)] transition-shadow duration-300 border border-outline-variant/20 flex flex-col relative cursor-pointer block"
                  >
                    <div className="absolute top-4 right-4 z-10 bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-md">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </div>
                    <div className="h-56 w-full relative overflow-hidden">
                      <img
                        alt={property.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        src={property.images?.[0] || '/placeholder.jpg'}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-h2 text-h2 text-on-surface group-hover:text-primary transition-colors">{property.title}</h3>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mb-stack-sm">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        {property.location?.address}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-stack-md">
                        {property.amenities?.slice(0, 3).map((amenity) => (
                          <div key={amenity} className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                            <span className="material-symbols-outlined text-[16px]">{amenityIconMap[amenity] || 'check_circle'}</span>
                            {amenity}
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-end">
                        <div>
                          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Starting from</p>
                          <p className="font-h2 text-h2 text-primary font-bold">
                            ₹{property.price?.toLocaleString('en-IN')}
                            <span className="font-body-md text-body-md font-normal text-on-surface-variant">/mo</span>
                          </p>
                        </div>
                        <button className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-body-md text-body-md font-semibold hover:bg-on-secondary-fixed-variant transition-colors shadow-sm cursor-pointer">
                          View Details
                        </button>
                      </div>
                    </div>
                  </Link>
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

          {/* Load More */}
          {!loading && properties.length > 0 && hasMore && (
            <div className="mt-stack-lg flex justify-center">
              <button onClick={handleLoadMore} className="px-8 py-3 rounded-full border-2 border-primary text-primary font-body-lg text-body-lg font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-sm hover:shadow-md cursor-pointer">
                Load More Properties
              </button>
            </div>
          )}
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(76,29,149,0.05)] rounded-t-xl md:hidden">
        <Link className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container dark:bg-primary-fixed-dim dark:text-on-primary-fixed rounded-full px-5 py-1 scale-90 transition-all duration-200" href="/pgs">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-sm text-label-sm mt-1">Search</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim cursor-pointer" href="/dashboard">
          <span className="material-symbols-outlined mb-1">favorite</span>
          <span className="font-label-sm text-label-sm mt-1">Saved</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim cursor-pointer" href="/dashboard">
          <span className="material-symbols-outlined mb-1">receipt_long</span>
          <span className="font-label-sm text-label-sm mt-1">Bookings</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim cursor-pointer" href="/dashboard/profile">
          <span className="material-symbols-outlined mb-1">person</span>
          <span className="font-label-sm text-label-sm mt-1">Profile</span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="w-full mt-stack-lg bg-surface-container-highest dark:bg-on-background border-t border-outline-variant dark:border-outline py-stack-lg px-margin-mobile md:px-gutter pb-24 md:pb-stack-lg">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-stack-md">
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="font-display text-h1 text-primary dark:text-primary-fixed-dim">
              PG Genie
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your digital concierge for finding the perfect student accommodation in Kothri. Simple, secure, and magical.
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-4">
              © 2026 PG Genie. Dedicated to VIT Bhopal Community.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-h2 text-h2 text-on-surface mb-2">Quick Links</h4>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="/owner/dashboard">Owner Dashboard</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Help Center</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Privacy Policy</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
