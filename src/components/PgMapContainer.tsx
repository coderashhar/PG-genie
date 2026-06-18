"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

const PropertyDisplayMap = dynamic(() => import('@/components/PropertyDisplayMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] md:h-[400px] bg-surface-container rounded-xl flex items-center justify-center animate-pulse border border-outline-variant"><span className="material-symbols-outlined text-primary text-3xl">map</span></div>
});

interface PgMapContainerProps {
  lat?: number;
  lng?: number;
  address: string;
  title: string;
}

export default function PgMapContainer({ lat, lng, address, title }: PgMapContainerProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '400px 0px',
  });

  return (
    <div className="mb-stack-lg" ref={ref}>
      <h2 className="font-h2 text-h2 text-on-surface mb-stack-sm">Location</h2>
      {inView ? (
        <PropertyDisplayMap 
          lat={lat} 
          lng={lng} 
          address={address} 
          title={title}
        />
      ) : (
        <div className="w-full h-[300px] md:h-[400px] bg-surface-container rounded-xl flex items-center justify-center border border-outline-variant animate-pulse"></div>
      )}
    </div>
  );
}
