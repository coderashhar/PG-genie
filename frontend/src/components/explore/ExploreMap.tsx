'use client';

import React from 'react';

interface PGPin {
  id: string;
  name: string;
  price: string;
  type: string;
}

const PG_LOCATIONS: PGPin[] = [
  { id: '1', name: 'Emerald Heights', price: '₹8,500/mo', type: 'Boys PG' },
  { id: '2', name: 'Sunrise Residency', price: '₹9,200/mo', type: 'Girls PG' },
  { id: '3', name: 'The Oasis', price: '₹7,800/mo', type: 'Coliving' },
  { id: '4', name: 'Green Valley PG', price: '₹6,500/mo', type: 'Boys PG' },
  { id: '5', name: 'Campus Nest', price: '₹10,000/mo', type: 'Girls PG' },
  { id: '6', name: 'Royal Stay PG', price: '₹8,000/mo', type: 'Coliving' },
];

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export function ExploreMap() {
  const embedSrc = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=VIT+Bhopal+University,Bhopal&zoom=14&maptype=roadmap`;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-outline/50 relative bg-surface-dim">
      <iframe
        className="w-full h-full border-0"
        src={embedSrc}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="PG locations near VIT Bhopal"
      />

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

      {/* PG list overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 max-h-[140px] overflow-y-auto hide-scrollbar">
          <p className="text-[10px] font-semibold text-on-surface/40 uppercase tracking-wider mb-2">Nearby PGs</p>
          <div className="space-y-1.5">
            {PG_LOCATIONS.map((pg) => (
              <div key={pg.id} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-xs font-medium text-primary">{pg.name}</span>
                  <span className="text-[10px] text-on-surface/40">{pg.type}</span>
                </div>
                <span className="text-[10px] font-bold text-accent">{pg.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
