"use client";

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import toast from 'react-hot-toast';

interface LocationPickerMapProps {
  onLocationSelect: (details: { address: string; city: string; state: string; lat?: number; lng?: number }) => void;
  initialAddress?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function LocationPickerMap({ onLocationSelect, initialAddress }: LocationPickerMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const isMapReady = isLoaded || (typeof window !== 'undefined' && !!window.google?.maps);

  if (loadError && !isMapReady) {
    console.error("Map load error", loadError);
  }

  const defaultCenter = useMemo(() => ({ lat: 23.0763, lng: 76.8523 }), []);
  const [position, setPosition] = useState(defaultCenter);
  const [loading, setLoading] = useState(false);
  
  const mapRef = useRef<google.maps.Map | null>(null);

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      if (response.results && response.results[0]) {
        const addressComponents = response.results[0].address_components;
        let city = '';
        let state = '';
        
        for (const component of addressComponents) {
          if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
        }
        
        onLocationSelect({
          address: response.results[0].formatted_address,
          city,
          state,
          lat,
          lng
        });
      }
    } catch (err) {
      console.error("Geocoding failed", err);
      toast.error("Failed to automatically detect address details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
      fetchAddressFromCoords(lat, lng);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
      fetchAddressFromCoords(lat, lng);
    }
  };

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
        setPosition({ lat, lng });
        
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
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

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    mapRef.current = null;
  }, []);

  return (
    <div className="relative w-full h-[300px] bg-surface-container rounded-xl overflow-hidden border border-outline-variant">
      {isMapReady ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={13}
          onClick={handleMapClick}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            mapTypeControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          <Marker 
            position={position}
            draggable={true}
            onDragEnd={handleDragEnd}
          />
        </GoogleMap>
      ) : (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-container/80 backdrop-blur-sm text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

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
