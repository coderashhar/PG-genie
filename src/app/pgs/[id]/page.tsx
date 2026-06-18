"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

const PropertyDisplayMap = dynamic(() => import('@/components/PropertyDisplayMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] md:h-[400px] bg-surface-container rounded-xl flex items-center justify-center animate-pulse border border-outline-variant"><span className="material-symbols-outlined text-primary text-3xl">map</span></div>
});

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
  'Power Backup': 'battery_charging_full',
  CCTV: 'security',
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

export default function PgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery states
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const { ref: mapRef, inView: isMapInView } = useInView({
    triggerOnce: true,
    rootMargin: '400px 0px',
  });

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error('Please sign in to save PGs!');
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    
    setIsSaving(true);
    try {
      if (isSaved) {
        // Unsave
        const res = await fetch('/api/users/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pgId: property._id })
        });
        const data = await res.json();
        if (res.ok) {
          setIsSaved(false);
          toast.success('Removed from Favorites!');
        } else {
          toast.error(data.error || 'Failed to remove from favorites');
        }
      } else {
        // Save
        const res = await fetch('/api/users/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pgId: property._id })
        });
        const data = await res.json();
        if (res.ok) {
          setIsSaved(true);
          toast.success('Added to Favorites!');
        } else {
          toast.error(data.error || data.message || 'Failed to save');
        }
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBookClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error('Please sign in to book a visit!');
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    
    setIsBooking(true);
    try {
      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() + 1); // Tomorrow

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pgId: property._id,
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
      setIsBooking(false);
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error('Please sign in to view contact details!');
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    
    if (property?.ownerId?.phone) {
      window.location.href = `tel:${property.ownerId.phone}`;
    } else {
      toast.error('Contact number not available for this owner.');
    }
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => setIsGalleryOpen(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % (property?.images?.length || 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? (property?.images?.length || 1) - 1 : prev - 1));
  };

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error('Failed to fetch property details');
        const data = await res.json();
        setProperty(data.property);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  useEffect(() => {
    async function checkSavedStatus() {
      if (session?.user) {
        try {
          const res = await fetch('/api/users/favorites');
          if (res.ok) {
            const data = await res.json();
            const saved = data.favorites?.some((p: any) => p._id === id || p === id);
            setIsSaved(!!saved);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    checkSavedStatus();
  }, [id, session]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="bg-error-container text-on-error-container p-6 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p>{error || 'Property not found'}</p>
        </div>
        <Link href="/pgs" className="text-primary hover:underline">Go Back to Search</Link>
      </div>
    );
  }

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
        <section className={`grid gap-base h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-stack-lg grid-cols-1 ${property?.images?.length === 1 ? 'md:grid-cols-1' : property?.images?.length === 2 ? 'md:grid-cols-2' : property?.images?.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} grid-rows-2`}>
          {property?.images?.[0] && (
            <div className={`${property.images.length === 1 ? 'md:col-span-1 md:row-span-2' : property.images.length === 2 ? 'md:col-span-1 md:row-span-2' : 'md:col-span-2 md:row-span-2'} relative group cursor-pointer overflow-hidden`} onClick={() => openGallery(0)}>
              <Image fill alt="Main PG Image" className="object-cover transition-transform duration-500 group-hover:scale-105" src={property.images[0]} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          )}
          {property?.images?.[1] && (
            <div className={`hidden md:block relative group cursor-pointer overflow-hidden ${property.images.length === 2 ? 'md:col-span-1 md:row-span-2' : ''}`} onClick={() => openGallery(1)}>
              <Image fill alt="PG Image 2" className="object-cover transition-transform duration-500 group-hover:scale-105" src={property.images[1]} />
            </div>
          )}
          {property?.images?.[2] && (
            <div className={`hidden md:block relative group cursor-pointer overflow-hidden ${property.images.length === 3 ? 'md:col-span-1 md:row-span-2' : ''}`} onClick={() => openGallery(2)}>
              <Image fill alt="PG Image 3" className="object-cover transition-transform duration-500 group-hover:scale-105" src={property.images[2]} />
            </div>
          )}
          {property?.images?.[3] && (
            <div className={`hidden md:block relative group cursor-pointer overflow-hidden ${property.images.length === 4 ? 'md:col-span-2' : ''}`} onClick={() => openGallery(3)}>
              <Image fill alt="PG Image 4" className="object-cover transition-transform duration-500 group-hover:scale-105" src={property.images[3]} />
            </div>
          )}
          {property?.images?.[4] && (
            <div className="hidden md:block relative group cursor-pointer overflow-hidden" onClick={() => openGallery(4)}>
              <Image fill alt="PG Image 5" className="object-cover transition-transform duration-500 group-hover:scale-105" src={property.images[4]} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/50">
                <span className="text-on-primary font-h2 text-h2 flex items-center gap-2">
                  <span className="material-symbols-outlined">photo_library</span> {property.images.length > 5 ? `+${property.images.length - 5} Photos` : 'View Gallery'}
                </span>
              </div>
            </div>
          )}
        </section>

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
                    .filter(a => property[a.key])
                    .map(a => a.label);
                  const uniqueAmenities = Array.from(new Set([...(property.amenities || []), ...activeBooleans]));
                  
                  return uniqueAmenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all text-center gap-2">
                      <span className="material-symbols-outlined text-[32px] text-primary">{amenityIconMap[amenity] || 'check_circle'}</span>
                      <span className="font-label-sm text-label-sm text-on-surface">{amenity}</span>
                    </div>
                  ));
                })()}
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
            <div className="mb-stack-lg" ref={mapRef}>
              <h2 className="font-h2 text-h2 text-on-surface mb-stack-sm">Location</h2>
              {isMapInView ? (
                <PropertyDisplayMap 
                  lat={property.location?.lat} 
                  lng={property.location?.lng} 
                  address={`${property.location?.address || ''}, ${property.location?.city || ''}, ${property.location?.state || ''}`} 
                  title={property.title}
                />
              ) : (
                <div className="w-full h-[300px] md:h-[400px] bg-surface-container rounded-xl flex items-center justify-center border border-outline-variant"></div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Action Sidebar */}
          <div className="w-full lg:w-[350px]">
            <div className="sticky top-[88px] bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <p className="font-body-md text-body-md text-on-surface-variant mb-1">Starting from</p>
                <div className="flex items-end gap-2">
                  <span className="font-display text-h1 text-primary">₹{property.price?.toLocaleString('en-IN')}</span>
                  <span className="font-body-md text-body-md text-on-surface-variant mb-1">/ month</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleBookClick}
                  disabled={isBooking}
                  className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary font-label-sm text-label-sm py-4 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  {isBooking ? 'Booking...' : 'Book a Visit'}
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={handleContactClick}
                    className="flex-1 bg-surface-container-lowest border-2 border-primary text-primary hover:bg-primary/5 font-label-sm text-label-sm py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    Contact
                  </button>
                  <button 
                    onClick={handleSaveClick}
                    disabled={isSaving}
                    className={`flex-1 border-2 font-label-sm text-label-sm py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
                      isSaved 
                        ? 'bg-secondary text-on-secondary border-secondary hover:bg-secondary/90' 
                        : 'bg-surface-container-lowest text-secondary border-secondary hover:bg-secondary/5'
                    }`}
                  >
                    <span 
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {isSaved ? 'favorite' : 'favorite_border'}
                    </span>
                    {isSaving ? 'Please wait...' : isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
              <div className="mt-6 bg-surface-container-low p-4 rounded-lg">
                <h3 className="font-label-sm text-label-sm text-on-surface mb-2">Available Room Types</h3>
                <ul className="flex flex-col gap-2">
                  {property.roomTypes?.map((rt: string, idx: number) => (
                    <li key={idx} className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                      <span>{rt}</span>
                      <span className="font-semibold text-on-surface">Available</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 font-label-sm text-label-sm text-center text-outline flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">info</span> No brokerage fees via PG Genie
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Full Screen Image Gallery Modal */}
      {isGalleryOpen && property?.images?.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closeGallery}>
          <button className="absolute top-6 right-6 text-white hover:text-gray-300 z-50 p-2 cursor-pointer" onClick={closeGallery}>
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          
          <button className="absolute left-4 md:left-12 text-white hover:text-gray-300 z-50 p-4 cursor-pointer" onClick={prevImage}>
            <span className="material-symbols-outlined text-5xl">chevron_left</span>
          </button>
          
          <div className="relative w-full max-w-6xl h-[80vh] px-4 sm:px-16 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image 
                src={property.images[currentImageIndex]} 
                alt={`Gallery image ${currentImageIndex + 1}`} 
                fill
                className="object-contain select-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/80 font-body-md tracking-widest">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>

          <button className="absolute right-4 md:right-12 text-white hover:text-gray-300 z-50 p-4 cursor-pointer" onClick={nextImage}>
            <span className="material-symbols-outlined text-5xl">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
