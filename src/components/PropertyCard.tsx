"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

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
  'Washing Machine': 'local_laundry_service',
  'Pet Friendly': 'pets',
};

interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode?: string;
}

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    location: PropertyLocation;
    price: number;
    images: string[];
    amenities: string[];
    [key: string]: any;
  };
  initialIsSaved: boolean;
  onSaveToggle?: (pgId: string, newIsSaved: boolean) => void;
  onClick?: () => void;
  priority?: boolean;
}

export default function PropertyCard({ property, initialIsSaved, onSaveToggle, onClick, priority = false }: PropertyCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if prop changes
  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Please sign in to save PGs!');
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    const currentlySaved = isSaved;

    try {
      if (currentlySaved) {
        const res = await fetch('/api/users/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pgId: property._id })
        });
        if (res.ok) {
          setIsSaved(false);
          toast.success('Removed from Favorites!');
          if (onSaveToggle) onSaveToggle(property._id, false);
        } else {
          toast.error('Failed to remove from favorites');
        }
      } else {
        const res = await fetch('/api/users/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pgId: property._id })
        });
        if (res.ok) {
          setIsSaved(true);
          toast.success('Added to Favorites!');
          if (onSaveToggle) onSaveToggle(property._id, true);
        } else {
          toast.error('Failed to save');
        }
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

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

  const activeBooleanAmenities = booleanAmenitiesList
    .filter(a => property[a.key])
    .map(a => a.label);

  const uniqueAmenities = Array.from(new Set([...(property.amenities || []), ...activeBooleanAmenities]));

  return (
    <Link
      href={`/pgs/${property._id}`}
      onClick={() => { if (onClick) onClick(); }}
      className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(76,29,149,0.05)] hover:shadow-[0px_8px_30px_rgba(76,29,149,0.15)] transition-shadow duration-300 border border-outline-variant/20 flex flex-col relative cursor-pointer block"
    >
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <div className="bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-md">
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
        </div>
        <button 
          onClick={handleSaveClick}
          disabled={isSaving}
          className={`bg-surface/80 backdrop-blur-sm p-1.5 rounded-full shadow-md transition-colors flex items-center justify-center cursor-pointer disabled:opacity-70 ${isSaved ? 'text-secondary' : 'text-on-surface hover:text-secondary'}`}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
            {isSaved ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>
      <div className="h-56 w-full relative overflow-hidden">
        <Image
          alt={property.title}
          fill
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
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
          {uniqueAmenities.slice(0, 3).map((amenity) => (
            <div key={amenity} className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">{amenityIconMap[amenity] || 'check_circle'}</span>
              {amenity}
            </div>
          ))}
          {uniqueAmenities.length > 3 && (
            <div className="bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center border border-outline-variant/30 whitespace-nowrap">
              +{uniqueAmenities.length - 3} more
            </div>
          )}
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
}
