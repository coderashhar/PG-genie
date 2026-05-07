'use client';

import React, { useState } from 'react';

interface Filters {
  priceMin: number;
  priceMax: number;
  distance: number;
  amenities: string[];
  gender: string;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const AMENITIES = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'ac', label: 'AC' },
  { id: 'food', label: 'Food' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'parking', label: 'Parking' },
];

const GENDERS = ['Boys', 'Girls', 'Coliving'];

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const toggleAmenity = (id: string) => {
    const next = filters.amenities.includes(id)
      ? filters.amenities.filter((a) => a !== id)
      : [...filters.amenities, id];
    onChange({ ...filters, amenities: next });
  };

  return (
    <aside className="w-full space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-serif text-primary mb-1">Filters</h2>
        <div className="accent-line" />
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-on-surface/60 font-medium">
            <span>₹{filters.priceMin.toLocaleString()}</span>
            <span>₹{filters.priceMax.toLocaleString()}</span>
          </div>
          <input
            id="filter-price-min"
            type="range"
            min={3000}
            max={25000}
            step={500}
            value={filters.priceMin}
            onChange={(e) => onChange({ ...filters, priceMin: +e.target.value })}
            className="range-slider"
          />
          <input
            id="filter-price-max"
            type="range"
            min={3000}
            max={25000}
            step={500}
            value={filters.priceMax}
            onChange={(e) => onChange({ ...filters, priceMax: +e.target.value })}
            className="range-slider"
          />
        </div>
      </FilterSection>

      {/* Distance */}
      <FilterSection title="Distance from VIT Bhopal">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-on-surface/60 font-medium">
            <span>0 km</span>
            <span>{filters.distance} km</span>
          </div>
          <input
            id="filter-distance"
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={filters.distance}
            onChange={(e) => onChange({ ...filters, distance: +e.target.value })}
            className="range-slider"
          />
        </div>
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities">
        <div className="space-y-3">
          {AMENITIES.map((a) => (
            <label key={a.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="m3-checkbox"
                checked={filters.amenities.includes(a.id)}
                onChange={() => toggleAmenity(a.id)}
              />
              <span className="text-sm text-on-surface group-hover:text-primary transition-colors">
                {a.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Gender Toggle */}
      <FilterSection title="Property Type">
        <div className="m3-segment-group">
          {GENDERS.map((g) => (
            <button
              key={g}
              className={`m3-segment-btn ${filters.gender === g ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, gender: g })}
            >
              {g}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Apply button */}
      <button
        id="apply-filters-btn"
        className="w-full py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition-all duration-300 active:scale-[0.97]"
      >
        Apply Filters
      </button>
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-on-surface/50 uppercase tracking-[0.12em] mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
