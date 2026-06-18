"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [priceRange, setPriceRange] = useState<string>(() => {
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    if (!min && !max) return 'any';
    if (!min && max === '5000') return 'under_5k';
    if (min === '5000' && max === '8000') return '5k_8k';
    if (min === '8000' && max === '12000') return '8k_12k';
    if (min === '12000' && !max) return 'above_12k';
    return 'any';
  });
  
  const [genderPreference, setGenderPreference] = useState<string>(searchParams.get('gender') || '');
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(() => {
    const am = searchParams.get('amenities');
    return am ? am.split(',') : [];
  });

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page to 1 when filters change
    params.set('page', '1');

    // Price
    params.delete('minPrice');
    params.delete('maxPrice');
    if (priceRange === 'under_5k') {
      params.set('maxPrice', '5000');
    } else if (priceRange === '5k_8k') {
      params.set('minPrice', '5000');
      params.set('maxPrice', '8000');
    } else if (priceRange === '8k_12k') {
      params.set('minPrice', '8000');
      params.set('maxPrice', '12000');
    } else if (priceRange === 'above_12k') {
      params.set('minPrice', '12000');
    }

    // Gender
    if (genderPreference) {
      params.set('gender', genderPreference);
    } else {
      params.delete('gender');
    }

    // Amenities
    if (selectedAmenities.length > 0) {
      params.set('amenities', selectedAmenities.join(','));
    } else {
      params.delete('amenities');
    }

    router.push(`/pgs?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setPriceRange('any');
    setGenderPreference('');
    setSelectedAmenities([]);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('gender');
    params.delete('amenities');
    params.delete('search');
    params.set('page', '1');
    params.delete('sort');
    
    router.push(`/pgs?${params.toString()}`);
  };

  return (
    <aside className="w-full md:w-72 flex-shrink-0 space-y-stack-md hidden md:block">
      <div className="bg-surface-container-low rounded-xl p-6 shadow-sm border border-outline-variant/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-h2 text-h2 text-on-surface">Filters</h2>
          <button onClick={handleClearFilters} className="text-primary font-body-md text-body-md hover:underline cursor-pointer">Clear all</button>
        </div>

        {/* Price Range */}
        <div className="mb-stack-md">
          <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Price Range (Monthly)</h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={priceRange === 'any'} onChange={() => setPriceRange('any')} className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
              <span className="font-body-md text-body-md text-on-surface-variant">Any Price</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={priceRange === 'under_5k'} onChange={() => setPriceRange('under_5k')} className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
              <span className="font-body-md text-body-md text-on-surface-variant">Under ₹5,000</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={priceRange === '5k_8k'} onChange={() => setPriceRange('5k_8k')} className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
              <span className="font-body-md text-body-md text-on-surface-variant">₹5,000 - ₹8,000</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={priceRange === '8k_12k'} onChange={() => setPriceRange('8k_12k')} className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
              <span className="font-body-md text-body-md text-on-surface-variant">₹8,000 - ₹12,000</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={priceRange === 'above_12k'} onChange={() => setPriceRange('above_12k')} className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
              <span className="font-body-md text-body-md text-on-surface-variant">Above ₹12,000</span>
            </label>
          </div>
        </div>

        <hr className="border-outline-variant/50 mb-stack-md" />

        {/* Gender */}
        <div className="mb-stack-md">
          <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Gender Preference</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setGenderPreference(genderPreference === 'Boys' ? '' : 'Boys')}
              className={`px-4 py-2 rounded-full border font-body-md text-body-md cursor-pointer transition-colors ${genderPreference === 'Boys' ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline bg-surface text-on-surface-variant hover:bg-surface-container-high'}`}>
              Boys
            </button>
            <button 
              onClick={() => setGenderPreference(genderPreference === 'Girls' ? '' : 'Girls')}
              className={`px-4 py-2 rounded-full border font-body-md text-body-md cursor-pointer transition-colors ${genderPreference === 'Girls' ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline bg-surface text-on-surface-variant hover:bg-surface-container-high'}`}>
              Girls
            </button>
            <button 
              onClick={() => setGenderPreference(genderPreference === 'Co-ed' ? '' : 'Co-ed')}
              className={`px-4 py-2 rounded-full border font-body-md text-body-md cursor-pointer transition-colors ${genderPreference === 'Co-ed' ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline bg-surface text-on-surface-variant hover:bg-surface-container-high'}`}>
              Co-ed
            </button>
          </div>
        </div>

        <hr className="border-outline-variant/50 mb-stack-md" />

        {/* Facilities */}
        <div className="mb-stack-md">
          <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Facilities</h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('WiFi')} onChange={() => toggleAmenity('WiFi')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">wifi</span>
              <span className="font-body-md text-body-md text-on-surface-variant">High-Speed WiFi</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('AC')} onChange={() => toggleAmenity('AC')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">ac_unit</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Air Conditioning</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('Meals')} onChange={() => toggleAmenity('Meals')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">restaurant</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Meals Included</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('Laundry')} onChange={() => toggleAmenity('Laundry')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">local_laundry_service</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Laundry</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('Furniture')} onChange={() => toggleAmenity('Furniture')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">chair</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Furniture</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('AttachedBath')} onChange={() => toggleAmenity('AttachedBath')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">bathtub</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Attached Bath</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('WaterSupply')} onChange={() => toggleAmenity('WaterSupply')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">water_drop</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Water Supply</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('Geyser')} onChange={() => toggleAmenity('Geyser')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">heat_pump</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Geyser</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('BackupPower')} onChange={() => toggleAmenity('BackupPower')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">battery_charging_full</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Backup Power</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('CCTV')} onChange={() => toggleAmenity('CCTV')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">videocam</span>
              <span className="font-body-md text-body-md text-on-surface-variant">CCTV</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('WashingMachine')} onChange={() => toggleAmenity('WashingMachine')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">local_laundry_service</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Washing Machine</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input checked={selectedAmenities.includes('PetFriendly')} onChange={() => toggleAmenity('PetFriendly')} className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
              <span className="material-symbols-outlined text-on-surface-variant text-xl">pets</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Pet Friendly</span>
            </label>
          </div>
        </div>

        <hr className="border-outline-variant/50 mb-stack-md" />

        {/* Distance from VIT */}
        <div className="mb-stack-md">
          <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Distance from VIT</h3>
          <input className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" max="10" min="0" type="range" defaultValue="3" />
          <div className="flex justify-between mt-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">0 km</span>
            <span className="font-label-sm text-label-sm text-primary">Up to 3 km</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">10+ km</span>
          </div>
        </div>

        <button onClick={handleApplyFilters} className="w-full bg-primary text-on-primary py-3 rounded-lg font-body-lg text-body-lg font-semibold hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
          Apply Filters
        </button>
      </div>
    </aside>
  );
}
