"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';

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
};

export default function PgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {/* TopNavBar */}
      <nav className="w-full sticky top-0 z-40 shadow-sm bg-surface">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
          <span className="font-display text-h2 font-extrabold text-primary cursor-default">PG Genie</span>
          <div className="hidden md:flex flex-1 justify-center max-w-md px-gutter">
            <div className="w-full relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
              <input className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface transition-all outline-none" placeholder="Search Kothri PGs..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="notifications" className="p-2 rounded-full hover:bg-primary-container/10 transition-colors text-on-surface-variant flex items-center justify-center group cursor-pointer">
              <span className="material-symbols-outlined group-active:opacity-80 group-active:scale-95 transition-transform">notifications</span>
            </button>
            <Link href="/dashboard/profile" aria-label="account_circle" className="p-2 rounded-full hover:bg-primary-container/10 transition-colors text-on-surface-variant flex items-center justify-center group cursor-pointer">
              <span className="material-symbols-outlined group-active:opacity-80 group-active:scale-95 transition-transform">account_circle</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-md">
        {/* Breadcrumb & Back */}
        <div className="mb-stack-sm flex items-center gap-2">
          <Link className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm flex items-center gap-1 transition-colors" href="/pgs">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Search
          </Link>
        </div>

        {/* Bento Grid Gallery */}
        <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-base h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-stack-lg">
          <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden">
            <img alt="Main PG Image" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <img alt="PG Image 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={property.images?.[1] || "https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?w=800&q=80"} />
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <img alt="PG Image 3" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={property.images?.[2] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"} />
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <img alt="PG Image 4" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={property.images?.[3] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"} />
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <img alt="PG Image 5" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={property.images?.[4] || "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/50">
              <span className="text-on-primary font-h2 text-h2 flex items-center gap-2">
                <span className="material-symbols-outlined">photo_library</span> {property.images?.length > 5 ? `+${property.images.length - 5} Photos` : 'View Gallery'}
              </span>
            </div>
          </div>
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
                {property.amenities?.map((amenity: string, idx: number) => (
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
            <div className="mb-stack-lg">
              <h2 className="font-h2 text-h2 text-on-surface mb-stack-sm">Location</h2>
              <div className="rounded-xl overflow-hidden border border-outline-variant shadow-sm h-[300px] relative bg-surface-container">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(`${property.title || ''}, ${property.location?.address || ''}, ${property.location?.city || ''}, ${property.location?.state || ''} ${property.location?.zipCode || ''}`.trim())}`}
                ></iframe>
              </div>
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
                <button className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary font-label-sm text-label-sm py-4 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  Book a Visit
                </button>
                <button className="w-full bg-surface-container-lowest border-2 border-primary text-primary hover:bg-primary/5 font-label-sm text-label-sm py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  Contact Owner
                </button>
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

      {/* Footer */}
      <footer className="w-full mt-stack-lg bg-surface-container-highest border-t border-outline-variant">
        <div className="w-full py-stack-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-stack-md">
          <div>
            <Link className="font-display text-h1 text-primary" href="/">PG Genie</Link>
            <p className="mt-2 text-on-surface-variant font-body-md text-body-md">© 2026 PG Genie. Dedicated to VIT Bhopal Community.</p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8">
            <Link className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">About Kothri</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="/owner/dashboard">Owner Dashboard</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">Help Center</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">Privacy Policy</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
