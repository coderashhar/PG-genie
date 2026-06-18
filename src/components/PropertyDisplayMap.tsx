"use client";

import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface PropertyDisplayMapProps {
  lat?: number;
  lng?: number;
  address?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function PropertyDisplayMap({ lat, lng, address }: PropertyDisplayMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const isMapReady = isLoaded || (typeof window !== 'undefined' && !!window.google?.maps);

  if (loadError && !isMapReady) {
    console.error("Map load error", loadError);
  }

  const parsedLat = lat ? Number(lat) : undefined;
  const parsedLng = lng ? Number(lng) : undefined;

  const center = useMemo(() => {
    if (parsedLat && parsedLng) {
      return { lat: parsedLat, lng: parsedLng };
    }
    return { lat: 23.0763, lng: 76.8523 };
  }, [parsedLat, parsedLng]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-surface-container rounded-xl overflow-hidden border border-outline-variant group">
      {isMapReady ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={parsedLat && parsedLng ? 16 : 12}
          options={{
            disableDefaultUI: false,
            mapTypeControl: true,
            streetViewControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          {parsedLat && parsedLng && (
            <Marker position={center} />
          )}
        </GoogleMap>
      ) : (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-container/80 backdrop-blur-sm text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Overlay link to open in Google Maps for directions */}
      {lat && lng && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 right-6 z-[400] bg-surface px-4 py-2 rounded-lg shadow-md font-label-sm flex items-center gap-2 hover:bg-surface-variant transition-colors border border-outline-variant cursor-pointer text-on-surface"
        >
          <span className="material-symbols-outlined text-primary text-[18px]">directions</span>
          Get Directions
        </a>
      )}

      {(!lat || !lng) && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center bg-surface-container/80 backdrop-blur-sm text-center p-6">
          <div className="max-w-md">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">location_off</span>
            <p className="font-body-md text-on-surface-variant">
              Exact map coordinates not provided for this property. <br />
              Address: {address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
