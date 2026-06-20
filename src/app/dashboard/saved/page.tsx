"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';

// --- Types ---
interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode?: string;
}

interface SavedPg {
  _id: string;
  title: string;
  description: string;
  location: PropertyLocation;
  price: number;
  images: string[];
  status: string;
  amenities: string[];
  roomTypes: string[];
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

// --- Loading skeleton ---
function CardSkeleton() {
  return (
    <div className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] overflow-hidden border border-surface-container animate-pulse flex flex-col">
      <div className="w-full aspect-video bg-surface-container" />
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="h-5 bg-surface-container rounded w-3/4" />
        <div className="h-4 bg-surface-container rounded w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-14 bg-surface-container rounded" />
          <div className="h-6 w-14 bg-surface-container rounded" />
        </div>
        <div className="h-8 bg-surface-container rounded mt-auto" />
      </div>
    </div>
  );
}

export default function SavedPgsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [savedPgs, setSavedPgs] = useState<SavedPg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    async function fetchSavedPgs() {
      try {
        const res = await fetch('/api/users/favorites');
        if (!res.ok) {
          throw new Error('Failed to fetch saved PGs');
        }
        const data = await res.json();
        setSavedPgs(data.favorites || []);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchSavedPgs();
    }
  }, [status, router]);

  return (
    <div className="bg-background min-h-screen text-on-background font-body-md py-stack-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto">
      {/* Breadcrumb & Header */}
      <div className="mb-stack-lg">
        <Link 
          href="/dashboard" 
          className="text-on-surface-variant hover:text-primary font-label-sm flex items-center gap-1 w-fit mb-4 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Dashboard
        </Link>
        <h1 className="font-display text-display text-primary mb-2 flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl">favorite</span>
          All Saved PGs
        </h1>
        <p className="font-body-lg text-on-surface-variant">
          Your complete list of shortlisted properties.
        </p>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-stack-lg flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-stack-lg">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : savedPgs.length > 0 ? (
          savedPgs.map((pg) => (
            <PropertyCard
              key={pg._id}
              property={pg}
              initialIsSaved={true}
              onSaveToggle={(pgId, isSaved) => {
                if (!isSaved) {
                  setSavedPgs(prev => prev.filter(p => p._id !== pgId));
                }
              }}
            />
          ))
        ) : (
          <div className="col-span-full bg-surface-container rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">favorite_border</span>
            <p className="font-body-lg text-on-surface-variant mb-6 max-w-sm">
              You haven&apos;t saved any PGs yet. Start exploring properties and click the heart icon to save them here!
            </p>
            <Link 
              href="/pgs" 
              className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity font-bold shadow-md"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
