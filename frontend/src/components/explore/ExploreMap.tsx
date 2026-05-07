'use client';

import React, { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

interface Property {
  id: string;
  title: string;
  price: string;
  type: string;
  location?: { lat: number; lng: number };
}

export function ExploreMap({ properties }: { properties: Property[] }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        setOptions({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_MAPS_API_KEY || "",
          version: "weekly",
        });

        const { Map } = await importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement, PinElement } = await importLibrary("marker") as google.maps.MarkerLibrary;

        if (!mapRef.current || !isMounted) return;

        const map = new Map(mapRef.current, {
          center: { lat: 23.0775, lng: 76.8513 }, // VIT Bhopal (Kothri Kalan) Coordinates
          zoom: 14,
          mapId: process.env.NEXT_PUBLIC_MAP_ID || "DEMO_MAP_ID", // Required for Advanced Markers
          disableDefaultUI: true, // Keeps it clean for that Awwwards look
        });

        // Loop through your PG data to create markers
        properties.forEach((pg) => {
          if (!pg.location) return;

          // Create the Amber Gold Pin
          const pin = new PinElement({
            background: "#FFC107", // Amber Gold
            borderColor: "#004D40", // Midnight Emerald
            glyphColor: "#004D40",
          });

          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: pg.location.lat, lng: pg.location.lng },
            title: pg.title,
            content: pin.element,
          });

          // Add a click listener to show PG details or redirect
          marker.addListener("click", () => {
            console.log(`Clicked on ${pg.title}`);
          });
        });
      } catch (e) {
        console.error("Google Maps failed to load", e);
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [properties]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-outline/50 relative bg-surface-dim">
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm z-10">
        <div className="flex items-center gap-4 text-[10px] text-on-surface/60 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" /> PG Location
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Campus
          </span>
        </div>
      </div>
    </div>
  );
}
