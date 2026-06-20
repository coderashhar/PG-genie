"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function Home() {
  const [location, setLocation] = useState("Kothri, MP");
  const [roomType, setRoomType] = useState("Any Type");
  const [budget, setBudget] = useState("any");

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (location && location !== "Kothri, MP") params.append("search", location);
    if (budget !== "any") params.append("priceRange", budget);
    // Note: roomType is not currently handled by the pgs page filters, but we could pass it if needed.
    return `/pgs?${params.toString()}`;
  };

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative w-full min-h-[70vh] md:min-h-[1024px] flex items-center justify-center pt-20 md:pt-24 pb-8 md:pb-12 overflow-hidden bg-surface-container-lowest">
          <div className="absolute inset-0 z-0">
            <img
              alt="Modern architectural student housing"
              className="w-full h-full object-cover scale-105 transform origin-center opacity-90"
              src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 md:to-transparent"></div>
          </div>

          <div className="relative z-10 w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-center md:justify-start gap-8 md:gap-20 h-full">
            <div className="w-full md:w-3/5 text-left opacity-0 animate-reveal mt-12 md:mt-0">
              <div className="hidden md:inline-flex mb-8 px-5 py-2 rounded-full glass-minimal text-sm font-semibold text-primary shadow-sm">
                <span className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  New verified listings added today in Kothri
                </span>
              </div>
              <h1 className="font-display text-[40px] md:text-[96px] leading-[1.1] md:leading-[1.05] tracking-tight text-white mb-4 md:mb-8 drop-shadow-md">
                Find your <span className="inline-block font-caveat text-[1.2em] md:text-[1.1em] text-secondary-fixed-dim -rotate-2 transform translate-y-1 mx-1 md:ml-2 md:mr-2">perfect home</span> near <br />
                <span className="font-light">VIT Bhopal</span>
              </h1>
              <p className="font-body-md md:font-body-lg md:text-xl text-white/90 max-w-xl mb-6 md:mb-12 font-light tracking-wide">
                The smartest way for students to discover, compare, and book verified accommodations. Your digital concierge to student living.
              </p>
            </div>

            <div className="w-full md:w-2/5 flex flex-col gap-4 md:gap-6 opacity-0 animate-reveal-delayed">
              <div className="w-full glass-minimal rounded-3xl p-5 md:p-8 flex flex-col gap-4 md:gap-6 shadow-2xl backdrop-blur-3xl">
                <div className="flex flex-col gap-2 border-b border-surface-variant/50 pb-2 md:pb-4">
                  <span className="text-label-sm text-on-surface-variant/70 uppercase font-bold tracking-widest hidden md:block">Location</span>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-on-surface/50 mr-2 md:hidden">location_on</span>
                    <input
                      className="bg-transparent border-none focus:ring-0 p-0 text-body-lg text-on-surface w-full font-medium cursor-pointer placeholder:text-on-surface/50 focus:outline-none"
                      placeholder="Search Location (e.g. Kothri)"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Desktop only fields */}
                <div className="hidden md:flex flex-col gap-2 border-b border-surface-variant/50 pb-4">
                  <span className="text-label-sm text-on-surface-variant/70 uppercase font-bold tracking-widest">Room Type</span>
                  <select
                    className="bg-transparent border-none focus:ring-0 p-0 text-body-lg text-on-surface w-full font-medium cursor-pointer appearance-none focus:outline-none"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    <option value="Any Type">Any Type</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                  </select>
                </div>
                <div className="hidden md:flex flex-col gap-2 pb-4">
                  <span className="text-label-sm text-on-surface-variant/70 uppercase font-bold tracking-widest">Budget</span>
                  <select
                    className="bg-transparent border-none focus:ring-0 p-0 text-body-lg text-on-surface w-full font-medium cursor-pointer appearance-none focus:outline-none"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    <option value="any">Any Budget</option>
                    <option value="under_5k">Under ₹5,000</option>
                    <option value="5k_8k">₹5,000 - ₹8,000</option>
                    <option value="8k_12k">₹8,000 - ₹12,000</option>
                    <option value="above_12k">Above ₹12,000</option>
                  </select>
                </div>

                <Link href={buildSearchUrl()} className="bg-primary hover:bg-primary-container text-white text-body-md font-semibold px-6 py-4 md:py-5 rounded-2xl transition-all duration-300 flex items-center justify-center w-full group relative overflow-hidden cursor-pointer shadow-lg">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></span>
                  <span className="material-symbols-outlined mr-2 md:mr-3 text-lg md:text-xl transition-transform group-hover:rotate-90">search</span>
                  Search Properties
                </Link>
              </div>

              {/* Mobile Popular Cities */}
              <div className="md:hidden flex justify-center items-center gap-2 text-white/80 text-sm mt-2">
                <span className="font-semibold text-white">Popular:</span>
                <span>Kothri</span>
                <span className="opacity-50">&bull;</span>
                <span>Ashta</span>
                <span className="opacity-50">&bull;</span>
                <span>Bhopal</span>
              </div>

              <div className="hidden md:grid grid-cols-3 gap-4 w-full">
                <div className="glass-minimal rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-md">
                  <span className="font-display text-2xl font-semibold text-primary">50+</span>
                  <span className="text-label-sm text-on-surface-variant/80 uppercase tracking-wider mt-1 text-[10px]">Verified</span>
                </div>
                <div className="glass-minimal rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-md">
                  <span className="font-display text-2xl font-semibold text-primary">1.2k</span>
                  <span className="text-label-sm text-on-surface-variant/80 uppercase tracking-wider mt-1 text-[10px]">Students</span>
                </div>
                <div className="glass-minimal rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-md">
                  <span className="font-display text-2xl font-semibold text-primary">100%</span>
                  <span className="text-label-sm text-on-surface-variant/80 uppercase tracking-wider mt-1 text-[10px]">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings - Asymmetric Grid */}
        <section className="w-full py-8 md:py-stack-xl bg-surface-container-lowest">
          <div className="px-margin-mobile md:px-gutter max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-6 md:mb-16">
              <div className="max-w-2xl">
                <h2 className="font-display text-[28px] md:text-[48px] text-on-surface leading-tight">
                  Curated Spaces <br /><span className="italic text-on-surface-variant font-light">for student living</span>
                </h2>
              </div>
              <Link href="/pgs" className="hidden md:flex text-on-surface font-body-md font-medium items-center hover:text-primary transition-colors group cursor-pointer">
                View collection <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1">trending_flat</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
              <div className="md:col-span-8 flex flex-col group cursor-pointer w-full">
                <Link href="/pgs/6a131e6f34188a11736f3cde" className="relative block w-full aspect-[21/9] md:aspect-[16/9] overflow-hidden rounded-2xl md:rounded-3xl mb-3 md:mb-6 bg-surface-container">
                  <img
                    alt="Premium student accommodation"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
                  />
                  <div className="absolute top-3 right-3 md:top-6 md:right-6 bg-white/90 backdrop-blur-md px-2 py-1 md:px-4 md:py-2 rounded-full flex items-center shadow-lg">
                    <span className="material-symbols-outlined text-secondary text-[10px] md:text-sm mr-1 md:mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="font-label-sm text-on-surface tracking-wide text-[10px] md:text-sm">Verified</span>
                  </div>
                </Link>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-lg md:text-3xl text-on-surface mb-0.5 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">Elite Co-living Spaces</h3>
                    <p className="font-body-md text-xs md:text-base text-on-surface-variant flex items-center mb-1.5 md:mb-4">
                      0.8 km from VIT Main Gate
                    </p>
                    <div className="flex flex-wrap gap-1 md:gap-3">
                      <span className="font-label-sm text-[10px] md:text-sm text-secondary bg-secondary/10 px-2 py-0.5 md:px-3 rounded-full uppercase tracking-wider">Meals</span>
                      <span className="font-label-sm text-[10px] md:text-sm text-secondary bg-secondary/10 px-2 py-0.5 md:px-3 rounded-full uppercase tracking-wider">Transport</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg md:text-3xl text-on-surface">₹9,000</div>
                    <div className="font-body-md text-xs md:text-base text-on-surface-variant">/month</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col group cursor-pointer mt-2 md:mt-24 w-full">
                <Link href="/pgs/6a131e6f34188a11736f3cdb" className="relative block w-full aspect-[21/9] md:aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl mb-3 md:mb-6 bg-surface-container">
                  <img
                    alt="Student PG interior"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?w=800&q=80"
                  />
                  <div className="absolute top-3 left-3 md:top-6 md:left-6 bg-primary text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold shadow-lg tracking-wider uppercase">
                    New
                  </div>
                </Link>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start md:items-end">
                    <div>
                      <h3 className="font-display text-lg md:text-2xl text-on-surface mb-0.5 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">Shanti Niwas</h3>
                      <p className="font-body-md text-xs md:text-base text-on-surface-variant flex items-center mb-1.5 md:mb-4">
                        1.2 km from VIT Main Gate
                      </p>
                    </div>
                    <div className="text-right md:hidden">
                      <div className="font-display text-lg md:text-2xl text-on-surface">₹7,500<span className="font-body-md text-xs md:text-base text-on-surface-variant font-sans">/mo</span></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-0 md:mt-2">
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      <span className="font-label-sm text-[10px] md:text-sm text-secondary bg-secondary/10 px-2 py-0.5 md:px-3 rounded-full uppercase tracking-wider">WiFi</span>
                      <span className="font-label-sm text-[10px] md:text-sm text-secondary bg-secondary/10 px-2 py-0.5 md:px-3 rounded-full uppercase tracking-wider">AC</span>
                    </div>
                    <div className="font-display text-xl md:text-2xl text-on-surface hidden md:block">₹7,500<span className="font-body-md text-sm md:text-base text-on-surface-variant font-sans">/mo</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full bg-surface-container py-stack-md md:py-stack-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 translate-x-1/4"></div>
          <div className="px-margin-mobile md:px-gutter max-w-container-max mx-auto relative z-10">
            <div className="mb-10 md:mb-20 text-center md:text-left">
              <h2 className="font-display text-[32px] md:text-[48px] text-on-surface leading-tight">Elevated Living <br /><span className="italic text-on-surface-variant font-light">simplified</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/30 transform -translate-x-1/2"></div>

              <div className="relative pr-0 md:pr-12">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-12">
                  <span className="font-display text-5xl md:text-6xl text-primary/20 italic">01</span>
                  <h3 className="font-display text-2xl md:text-3xl text-on-surface">For Students</h3>
                </div>
                <div className="space-y-8 md:space-y-12">
                  <div className="group relative pl-6 md:pl-8 border-l border-outline-variant hover:border-primary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-1 md:top-2 group-hover:border-primary group-hover:bg-primary transition-all duration-300"></div>
                    <h4 className="font-body-lg text-base md:text-lg font-semibold text-on-surface mb-2 md:mb-3">Discover &amp; Curate</h4>
                    <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">Filter meticulously verified properties based on proximity, aesthetics, and amenities tailored to the modern student lifestyle.</p>
                  </div>
                  <div className="group relative pl-6 md:pl-8 border-l border-outline-variant hover:border-primary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-1 md:top-2 group-hover:border-primary group-hover:bg-primary transition-all duration-300"></div>
                    <h4 className="font-body-lg text-base md:text-lg font-semibold text-on-surface mb-2 md:mb-3">Experience Virtually</h4>
                    <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">Immerse yourself in spaces through high-fidelity imagery and authentic resident reviews before stepping foot inside.</p>
                  </div>
                  <div className="group relative pl-6 md:pl-8 border-l border-outline-variant hover:border-primary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-1 md:top-2 group-hover:border-primary group-hover:bg-primary transition-all duration-300"></div>
                    <h4 className="font-body-lg text-base md:text-lg font-semibold text-on-surface mb-2 md:mb-3">Seamless Booking</h4>
                    <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">Secure your sanctuary instantly with our frictionless digital token system. No paperwork, just peace of mind.</p>
                  </div>
                </div>
              </div>

              <div className="relative pl-0 md:pl-12 md:mt-32">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-12">
                  <span className="font-display text-5xl md:text-6xl text-secondary/20 italic">02</span>
                  <h3 className="font-display text-2xl md:text-3xl text-on-surface">For Owners</h3>
                </div>
                <div className="space-y-8 md:space-y-12">
                  <div className="group relative pl-6 md:pl-8 border-l border-outline-variant hover:border-secondary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-1 md:top-2 group-hover:border-secondary group-hover:bg-secondary transition-all duration-300"></div>
                    <h4 className="font-body-lg text-base md:text-lg font-semibold text-on-surface mb-2 md:mb-3">Showcase Elegance</h4>
                    <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">Present your property to an exclusive audience of verified VIT students with our premium listing aesthetics.</p>
                  </div>
                  <div className="group relative pl-6 md:pl-8 border-l border-outline-variant hover:border-secondary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-1 md:top-2 group-hover:border-secondary group-hover:bg-secondary transition-all duration-300"></div>
                    <h4 className="font-body-lg text-base md:text-lg font-semibold text-on-surface mb-2 md:mb-3">Intelligent Lead Management</h4>
                    <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">Engage with highly qualified prospects through a sophisticated, centralized dashboard designed for conversion.</p>
                  </div>
                  <div className="group relative pl-6 md:pl-8 border-l border-outline-variant hover:border-secondary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-1 md:top-2 group-hover:border-secondary group-hover:bg-secondary transition-all duration-300"></div>
                    <h4 className="font-body-lg text-base md:text-lg font-semibold text-on-surface mb-2 md:mb-3">Frictionless Finance</h4>
                    <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">Choose your flow: automated professional settlements via Razorpay or instant, direct-to-owner payment pathway.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
