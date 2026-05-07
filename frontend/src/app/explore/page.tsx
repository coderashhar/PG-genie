'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { FilterSidebar } from '@/components/explore/FilterSidebar';
import { ExploreMap } from '@/components/explore/ExploreMap';
import {
  ArrowRight, MapPin, Wifi, Coffee, Car, Wind, Phone,
  SlidersHorizontal, X, Bed,
} from 'lucide-react';

/* ── Dummy data ── */
const LISTINGS = [
  { id: '1', title: 'Emerald Heights', type: 'Boys PG', distance: '1.2 km', price: '₹8,500', amenities: ['WiFi', 'AC', 'Food'], verified: true, tag: 'Popular', gradient: 'from-primary/15 to-primary/5' },
  { id: '2', title: 'Sunrise Residency', type: 'Girls PG', distance: '0.8 km', price: '₹9,200', amenities: ['WiFi', 'Laundry', 'CCTV'], verified: true, tag: 'Premium', gradient: 'from-accent/15 to-accent/5' },
  { id: '3', title: 'The Oasis Co-living', type: 'Coliving', distance: '1.5 km', price: '₹7,800', amenities: ['WiFi', 'Gym', 'Food'], verified: true, gradient: 'from-primary-light/15 to-primary/5' },
  { id: '4', title: 'Green Valley PG', type: 'Boys PG', distance: '2.0 km', price: '₹6,500', amenities: ['WiFi', 'Food', 'Parking'], verified: true, tag: 'Best Value', gradient: 'from-primary/10 to-accent/5' },
  { id: '5', title: 'Campus Nest', type: 'Girls PG', distance: '0.5 km', price: '₹10,000', amenities: ['WiFi', 'AC', 'Laundry', 'Food'], verified: true, tag: 'Nearest', gradient: 'from-accent/10 to-primary/5' },
  { id: '6', title: 'Royal Stay PG', type: 'Coliving', distance: '3.1 km', price: '₹8,000', amenities: ['WiFi', 'AC', 'Parking'], verified: false, gradient: 'from-primary/12 to-primary-light/5' },
];

export default function ExplorePage() {
  const [filters, setFilters] = useState({
    priceMin: 5000,
    priceMax: 15000,
    distance: 3,
    amenities: ['wifi'] as string[],
    gender: 'Boys',
  });

  const [activeChips, setActiveChips] = useState([
    { id: 'price', label: '₹5K – ₹15K' },
    { id: 'distance', label: 'Within 3 km' },
    { id: 'wifi', label: 'Wi-Fi' },
  ]);

  const [sortBy, setSortBy] = useState('rating');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const removeChip = (id: string) => {
    setActiveChips((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Spacer for fixed nav */}
      <div className="h-[72px]" />

      {/* ── Top Bar: Sort + Chips ── */}
      <div className="border-b border-outline/50 bg-white sticky top-[72px] z-30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
            {/* Mobile filter toggle */}
            <button
              id="mobile-filter-toggle"
              className="flex items-center gap-2 px-4 py-2 border border-outline rounded-full text-xs font-medium text-on-surface hover:border-primary hover:text-primary transition-colors"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            {/* Active chips */}
            {activeChips.map((chip) => (
              <div key={chip.id} className="filter-chip flex-shrink-0">
                {chip.label}
                <button onClick={() => removeChip(chip.id)} aria-label={`Remove ${chip.label}`}>
                  <X size={8} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-on-surface/50 hidden sm:inline">Sort by</span>
            <select
              id="sort-dropdown"
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Rating</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Main Layout: 50/50 Feed + Map ── */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Filter Sidebar (drawer) */}
        <div
          className={`
            fixed top-[72px] left-0 z-40 h-[calc(100vh-72px)] w-[280px]
            bg-white border-r border-outline/40 p-6 overflow-y-auto
            transition-transform duration-300 shadow-xl
            ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif text-primary">Filters</h2>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/5 text-on-surface/50 hover:text-primary transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>

        {/* Overlay */}
        {showMobileFilters && (
          <div
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setShowMobileFilters(false)}
          />
        )}

        {/* LEFT 50%: Property Feed */}
        <div className="w-full md:w-1/2 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="headline-serif text-primary text-2xl md:text-3xl">
                Explore PGs<span className="text-accent">.</span>
              </h1>
              <p className="text-xs text-on-surface/50 mt-1">
                {LISTINGS.length} properties near VIT Bhopal
              </p>
            </div>
          </div>

          {/* Listing Cards */}
          <div className="space-y-5">
            {LISTINGS.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>

          {/* Load more */}
          <div className="mt-10 mb-6 text-center">
            <button
              id="load-more-btn"
              className="px-8 py-3 border border-outline text-on-surface text-sm font-medium rounded-full hover:border-primary hover:text-primary transition-all duration-300"
            >
              Load More
            </button>
          </div>
        </div>

        {/* RIGHT 50%: Google Map */}
        <div className="hidden md:block w-1/2 sticky top-0 h-full p-4 pl-2">
          <ExploreMap />
        </div>
      </div>
    </main>
  );
}

/* ─── Listing Card ─── */

function ListingCard({
  listing,
  index,
}: {
  listing: (typeof LISTINGS)[0];
  index: number;
}) {
  return (
    <div
      className="explore-card flex flex-col sm:flex-row animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Image */}
      <div className={`relative w-full sm:w-[220px] h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br ${listing.gradient} flex items-center justify-center`}>
        <div className="absolute inset-0 grid-architectural opacity-20" />
        <Bed size={40} className="text-primary/15" strokeWidth={1} />

        {/* Verified badge */}
        {listing.verified && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-accent rounded-full shadow-sm">
            <Phone size={10} className="text-primary" strokeWidth={2.5} />
            <span className="text-[10px] font-bold text-primary">Verified</span>
          </div>
        )}

        {/* Tag */}
        {listing.tag && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-primary border border-outline/30">
            {listing.tag}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-semibold text-accent tracking-[0.15em] uppercase mb-1">
            {listing.type}
          </p>
          <h3 className="font-serif text-primary text-lg mb-1.5">{listing.title}</h3>
          <p className="text-xs text-on-surface/50 flex items-center gap-1">
            <MapPin size={11} />
            {listing.distance} from campus
          </p>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {listing.amenities.map((a) => (
            <span
              key={a}
              className="px-2.5 py-1 bg-surface-dim text-on-surface/55 text-[10px] font-medium rounded-full"
            >
              {a}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-outline/30">
          <div>
            <span className="text-xl font-serif text-primary">{listing.price}</span>
            <span className="text-[10px] text-on-surface/40 ml-1">/month</span>
          </div>
          <button className="flex items-center gap-1.5 px-5 py-2 bg-primary text-white text-xs font-medium rounded-full hover:bg-primary-dark transition-all duration-300 hover:shadow-md active:scale-[0.97]">
            View Details
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
