"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface PropertyDisplayMapProps {
  lat?: number;
  lng?: number;
  address?: string;
}

export default function PropertyDisplayMap({ lat, lng, address }: PropertyDisplayMapProps) {
  // If we don't have exact coordinates, try to show a default or fallback
  // (In a real app, you'd geocode the address here or rely solely on coordinates)
  const position: L.LatLngExpression = lat && lng ? [lat, lng] : [23.0763, 76.8523];
  
  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-surface-container rounded-xl overflow-hidden border border-outline-variant group">
      <MapContainer 
        center={position} 
        zoom={lat && lng ? 15 : 12} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lat && lng && (
          <Marker position={position} />
        )}
      </MapContainer>
      
      {/* Overlay link to open in Google Maps for directions */}
      {lat && lng && (
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 z-[400] bg-surface px-4 py-2 rounded-lg shadow-md font-label-sm flex items-center gap-2 hover:bg-surface-variant transition-colors border border-outline-variant cursor-pointer text-on-surface"
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
              Exact map coordinates not provided for this property. <br/>
              Address: {address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
