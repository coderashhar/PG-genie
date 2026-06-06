"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import toast from 'react-hot-toast';

interface LocationPickerMapProps {
  onLocationSelect: (details: { address: string; city: string; state: string }) => void;
  initialAddress?: string;
}

export default function LocationPickerMap({ onLocationSelect, initialAddress }: LocationPickerMapProps) {
  // Default to a central location (e.g., New Delhi or Bhopal depending on the user's focus)
  const defaultCenter: L.LatLngExpression = [23.0763, 76.8523]; // Approximate center near VIT Bhopal
  
  const [position, setPosition] = useState<L.LatLngExpression>(defaultCenter);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<any>(null);

  // Helper to reverse geocode
  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      
      if (data && data.address) {
        const addr = data.address;
        
        // Construct a sensible address string
        const parts = [];
        if (addr.house_number) parts.push(addr.house_number);
        if (addr.road) parts.push(addr.road);
        if (addr.suburb) parts.push(addr.suburb);
        if (addr.neighbourhood) parts.push(addr.neighbourhood);
        
        const fullAddress = parts.join(', ') || data.display_name.split(',').slice(0, 2).join(', ');
        
        const city = addr.city || addr.town || addr.village || addr.county || '';
        const state = addr.state || '';

        onLocationSelect({
          address: fullAddress,
          city,
          state
        });
      }
    } catch (err) {
      console.error("Geocoding failed", err);
      toast.error("Failed to automatically detect address details.");
    } finally {
      setLoading(false);
    }
  };

  // Draggable marker logic
  const eventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        const marker = e.target;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setPosition([latLng.lat, latLng.lng]);
          fetchAddressFromCoords(latLng.lat, latLng.lng);
        }
      },
    }),
    []
  );

  // Map clicks
  function MapEvents() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        fetchAddressFromCoords(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        
        if (mapRef.current) {
          mapRef.current.flyTo([lat, lng], 15);
        }

        fetchAddressFromCoords(lat, lng);
        toast.success("Location detected!");
      },
      (err) => {
        setLoading(false);
        console.error(err);
        toast.error('Unable to retrieve your location');
      }
    );
  };

  return (
    <div className="relative w-full h-[300px] bg-surface-container rounded-xl overflow-hidden border border-outline-variant">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        <Marker 
          position={position}
          draggable={true}
          eventHandlers={eventHandlers}
        />
      </MapContainer>

      {/* Overlay UI */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={loading}
          className="bg-surface shadow-md p-2 rounded-lg flex items-center gap-2 hover:bg-surface-variant transition-colors disabled:opacity-70 cursor-pointer border border-outline-variant"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-primary">my_location</span>
          )}
          <span className="font-label-sm text-on-surface text-sm hidden sm:inline">
            Detect My Location
          </span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-surface/90 backdrop-blur text-xs p-2 text-on-surface-variant z-[400] text-center border-t border-outline-variant">
        Drag the pin or click on the map to select the exact location of your PG.
      </div>
    </div>
  );
}
