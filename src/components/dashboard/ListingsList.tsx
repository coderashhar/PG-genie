"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropertyStatusToggle from './PropertyStatusToggle';
import EditPropertyButton from './EditPropertyButton';
import DeletePropertyButton from './DeletePropertyButton';

export default function ListingsList({ initialListings }: { initialListings: any[] }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 4, initialListings.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [initialListings.length]);

  return (
    <div className="space-y-4">
      {initialListings.length > 0 ? (
        <>
          {initialListings.slice(0, visibleCount).map((listing) => (
            <div key={listing._id} className="rounded-xl p-4 border border-outline-variant/50 flex flex-col sm:flex-row gap-4 bg-surface-container-lowest hover:border-primary/30 transition-all shadow-sm">
              <div className="w-full sm:w-48 h-32 rounded-lg relative overflow-hidden flex-shrink-0">
                <Image 
                  src={listing.images[0] || '/placeholder.jpg'} 
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  {listing.status === 'pending' && (
                    <span className="bg-tertiary text-on-tertiary px-2 py-1 rounded font-label-sm text-xs shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">pending_actions</span>
                      Pending Review
                    </span>
                  )}
                  {listing.status === 'active' && (
                    <span className="bg-primary text-on-primary px-2 py-1 rounded font-label-sm text-xs shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Available
                    </span>
                  )}
                  {listing.status === 'inactive' && (
                    <span className="bg-surface-variant text-on-surface-variant px-2 py-1 rounded font-label-sm text-xs shadow-sm flex items-center gap-1 opacity-90">
                      <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                      Filled
                    </span>
                  )}
                </div>
                {listing.status === 'inactive' && (
                  <div className="absolute inset-0 bg-surface/30 mix-blend-saturation pointer-events-none z-0"></div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-h2 text-body-lg text-on-surface hover:text-primary transition-colors cursor-pointer">
                        <Link href={`/pgs/${listing._id}`}>{listing.title}</Link>
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {listing.location.address}, {listing.location.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-h2 text-primary">₹{listing.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 sm:mt-0 pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <div className="flex items-center gap-1 font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      {listing.views}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <PropertyStatusToggle propertyId={listing._id} initialStatus={listing.status} />
                    <EditPropertyButton property={listing} />
                    <DeletePropertyButton propertyId={listing._id} propertyTitle={listing.title} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {visibleCount < initialListings.length && (
            <div ref={observerTarget} className="h-10 flex items-center justify-center">
              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-surface-container rounded-xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">apartment</span>
          <p className="font-body-lg text-on-surface-variant mb-4">You haven&apos;t added any properties yet.</p>
        </div>
      )}
    </div>
  );
}
