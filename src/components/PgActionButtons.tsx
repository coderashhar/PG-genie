"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

interface PgActionButtonsProps {
  propertyId: string;
  price: number;
  ownerPhone?: string;
  initialIsSaved: boolean;
}

export default function PgActionButtons({ propertyId, price, ownerPhone, initialIsSaved }: PgActionButtonsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

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
          body: JSON.stringify({ pgId: propertyId })
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
          body: JSON.stringify({ pgId: propertyId })
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
          pgId: propertyId,
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
    
    if (ownerPhone) {
      window.location.href = `tel:${ownerPhone}`;
    } else {
      toast.error('Contact number not available for this owner.');
    }
  };

  return (
    <div className="w-full lg:w-[350px]">
      <div className="sticky top-[88px] bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-lg">
        <div className="mb-6">
          <p className="font-body-md text-body-md text-on-surface-variant mb-1">Starting from</p>
          <div className="flex items-end gap-2">
            <span className="font-display text-h1 text-primary">₹{price?.toLocaleString('en-IN')}</span>
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
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                {isSaved ? 'favorite' : 'favorite_border'}
              </span>
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
