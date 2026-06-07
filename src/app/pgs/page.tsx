"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import PropertyCard from '@/components/PropertyCard';

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
  Furniture: 'chair',
  'Attached Bath': 'bathtub',
  'Water Supply': 'water_drop',
  Geyser: 'heat_pump',
  'Backup Power': 'battery_charging_full',
  CCTV: 'videocam',
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
  const [savedPgIds, setSavedPgIds] = useState<Set<string>>(new Set());
  const [isSavingMap, setIsSavingMap] = useState<Record<string, boolean>>({});

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchSavedPgs() {
      if (session?.user) {
        try {
          const res = await fetch('/api/users/favorites');
          if (res.ok) {
            const data = await res.json();
            const ids = new Set<string>(data.favorites?.map((p: any) => p._id || p) || []);
            setSavedPgIds(ids);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    fetchSavedPgs();
  }, [session]);

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

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState<string>(searchParams.get('priceRange') || 'any'); // 'any', 'under_5k', '5k_8k', '8k_12k', 'above_12k'
  const [genderPreference, setGenderPreference] = useState<string>(searchParams.get('gender') || '');
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

      if (genderPreference) {
        params.append('gender', genderPreference);
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
    setGenderPreference('');
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
    fetch(`/api/properties/${propertyId}/view`, { method: 'POST' }).catch(() => { });
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">

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
              <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Gender Preference</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setGenderPreference(genderPreference === 'Boys' ? '' : 'Boys')}
                  className={`px-4 py-2 rounded-full border font-body-md text-body-md cursor-pointer transition-colors ${genderPreference === 'Boys' ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline bg-surface text-on-surface-variant hover:bg-surface-container-high'}`}>
                  Boys
                </button>
                <button 
                  onClick={() => setGenderPreference(genderPreference === 'Girls' ? '' : 'Girls')}
                  className={`px-4 py-2 rounded-full border font-body-md text-body-md cursor-pointer transition-colors ${genderPreference === 'Girls' ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline bg-surface text-on-surface-variant hover:bg-surface-container-high'}`}>
                  Girls
                </button>
                <button 
                  onClick={() => setGenderPreference(genderPreference === 'Co-ed' ? '' : 'Co-ed')}
                  className={`px-4 py-2 rounded-full border font-body-md text-body-md cursor-pointer transition-colors ${genderPreference === 'Co-ed' ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline bg-surface text-on-surface-variant hover:bg-surface-container-high'}`}>
                  Co-ed
                </button>
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
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('Furniture')} onChange={() => toggleAmenity('Furniture')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">chair</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Furniture</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('AttachedBath')} onChange={() => toggleAmenity('AttachedBath')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">bathtub</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Attached Bath</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('WaterSupply')} onChange={() => toggleAmenity('WaterSupply')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">water_drop</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Water Supply</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('Geyser')} onChange={() => toggleAmenity('Geyser')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">heat_pump</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Geyser</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('BackupPower')} onChange={() => toggleAmenity('BackupPower')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">battery_charging_full</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Backup Power</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('CCTV')} onChange={() => toggleAmenity('CCTV')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">videocam</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">CCTV</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('WashingMachine')} onChange={() => toggleAmenity('WashingMachine')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">local_laundry_service</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Washing Machine</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked={selectedAmenities.includes('PetFriendly')} onChange={() => toggleAmenity('PetFriendly')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">pets</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Pet Friendly</span>
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
                />
                <button className="md:hidden ml-2 p-1.5 bg-surface rounded-full text-on-surface-variant shadow-sm border border-outline-variant flex items-center justify-center cursor-pointer hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">tune</span>
                </button>
              </div>

              <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
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
                          <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <div className="bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-md">
                              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                            </div>
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
    </div>
  );
}
