'use client';

import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Hero3DVisual } from '@/components/shared/Hero3DVisual';
import { Search, ArrowRight, Bed, Shield, Wifi, MessageCircle, Sparkles, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-primary/15 selection:text-primary">
      <Navbar />

      {/* ════════════════════ HERO SECTION ════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[72px]">
        {/* Subtle architectural grid background */}
        <div className="absolute inset-0 grid-architectural opacity-40 pointer-events-none" />

        {/* Ambient gradient orbs */}
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[100px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[calc(100vh-72px)]">
            {/* Left — Text Content */}
            <div className="flex flex-col justify-center py-12 lg:py-0">
              {/* Accent line */}
              <div className="accent-line mb-8 animate-fade-in-up" />

              {/* Main Headline */}
              <h1 className="headline-serif text-primary animate-fade-in-up delay-100">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                  STEP INTO
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] mt-1">
                  HOME<span className="text-accent">.</span>
                </span>
              </h1>

              {/* Subheader */}
              <p className="text-body text-on-surface text-base md:text-lg max-w-lg mt-6 mb-10 animate-fade-in-up delay-300 leading-relaxed">
                Seamless PG accommodations for students near VIT Bhopal.
                <br className="hidden sm:block" />
                Connecting you directly.
              </p>

              {/* ── Search Bar (Glassmorphism M3) ── */}
              <div className="search-glass rounded-full p-1.5 max-w-xl animate-fade-in-up delay-400 flex items-center">
                <div className="flex-1 flex items-center pl-5 gap-3">
                  <Search
                    size={20}
                    className="text-accent flex-shrink-0 transition-colors"
                    strokeWidth={2.5}
                  />
                  <input
                    id="hero-search-input"
                    type="text"
                    placeholder="Explore areas near VIT Bhopal..."
                    className="w-full bg-transparent border-none outline-none text-sm md:text-base text-foreground placeholder:text-gray-400 placeholder:italic py-3.5 font-sans"
                  />
                </div>
                <button
                  id="hero-search-btn"
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,77,64,0.25)] active:scale-[0.97] flex-shrink-0"
                >
                  <span className="hidden sm:inline">Search</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-8 mt-10 animate-fade-in-up delay-500">
                <QuickStat value="500+" label="Verified PGs" />
                <div className="w-px h-8 bg-outline" />
                <QuickStat value="2K+" label="Happy Students" />
                <div className="w-px h-8 bg-outline hidden sm:block" />
                <div className="hidden sm:block">
                  <QuickStat value="100%" label="Direct Connect" />
                </div>
              </div>
            </div>

            {/* Right — 3D Visual */}
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] animate-fade-in-right delay-300">
              <Hero3DVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ DIVIDER ════════════════════ */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-outline to-transparent" />

      {/* ════════════════════ FEATURES SECTION ════════════════════ */}
      <section className="py-24 md:py-32 bg-white relative" id="features-section">
        {/* Architectural grid bg */}
        <div className="absolute inset-0 grid-architectural opacity-25 pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="accent-line mb-4" />
              <h2 className="headline-serif text-primary text-3xl md:text-4xl lg:text-5xl">
                The Genie<br />Difference<span className="text-accent">.</span>
              </h2>
            </div>
            <p className="text-body text-on-surface text-sm md:text-base max-w-sm leading-relaxed">
              Curated experiences that transform how students discover their home away from home.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCardPremium
              icon={<Shield size={28} strokeWidth={1.5} />}
              title="Verified"
              subtitle="100% Inspected"
              description="Every listing personally verified by our team."
              index={0}
            />
            <FeatureCardPremium
              icon={<Wifi size={28} strokeWidth={1.5} />}
              title="Connected"
              subtitle="High-Speed WiFi"
              description="Seamless connectivity for study and play."
              index={1}
            />
            <FeatureCardPremium
              icon={<MessageCircle size={28} strokeWidth={1.5} />}
              title="Direct"
              subtitle="Zero Middlemen"
              description="Chat directly with owners. No brokers, ever."
              index={2}
            />
            <FeatureCardPremium
              icon={<Sparkles size={28} strokeWidth={1.5} />}
              title="Magic"
              subtitle="AI Matching"
              description="Smart recommendations tailored to your needs."
              index={3}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════ DIVIDER ════════════════════ */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-outline to-transparent" />

      {/* ════════════════════ CURATED SPACES ════════════════════ */}
      <section className="py-24 md:py-32 bg-surface-dim/30 relative" id="curated-section">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="accent-line mb-4" />
              <h2 className="headline-serif text-primary text-3xl md:text-4xl lg:text-5xl">
                Curated<br />Spaces<span className="text-accent">.</span>
              </h2>
            </div>
            <button
              id="view-all-btn"
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors group"
            >
              View all listings
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PropertyCardPremium
              title="Emerald Heights"
              type="Boys PG"
              location="Near Gate 1, VIT Bhopal"
              price="₹8,500"
              amenities={['WiFi', 'Meals', 'AC']}
              tag="Popular"
              imageGradient="from-primary/20 to-primary/5"
              index={0}
            />
            <PropertyCardPremium
              title="Sunrise Residency"
              type="Girls PG"
              location="Kothri Kalan, VIT Bhopal"
              price="₹9,200"
              amenities={['WiFi', 'Laundry', 'CCTV']}
              tag="Premium"
              imageGradient="from-accent/20 to-accent/5"
              index={1}
            />
            <PropertyCardPremium
              title="The Oasis"
              type="Co-living"
              location="Sehore Road, VIT Bhopal"
              price="₹7,800"
              amenities={['WiFi', 'Gym', 'Meals']}
              imageGradient="from-primary-light/20 to-primary/5"
              index={2}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA BANNER ════════════════════ */}
      <section className="py-20 md:py-28 bg-primary relative overflow-hidden" id="cta-section">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/[0.03] blur-[80px]" />
        <div className="absolute bottom-0 left-[10%] w-[200px] h-[200px] rounded-full bg-accent/[0.08] blur-[60px]" />
        <div className="absolute top-[20%] left-[5%] w-3 h-3 rounded-full bg-accent/40" style={{ animation: 'parallaxSlow 4s ease-in-out infinite' }} />
        <div className="absolute bottom-[30%] right-[8%] w-2 h-2 rounded-full bg-white/20" style={{ animation: 'parallaxFast 3s ease-in-out infinite' }} />

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 text-center relative z-10">
          <h2 className="headline-serif text-white text-3xl md:text-5xl lg:text-6xl mb-6">
            Ready to find<br />your space<span className="text-accent">?</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed font-sans">
            Join thousands of students who found their perfect PG accommodation through PG Genie.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="cta-explore-btn"
              className="px-8 py-3.5 bg-accent text-primary font-semibold rounded-full text-sm hover:bg-accent-light transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,193,7,0.3)] active:scale-[0.97]"
            >
              Start Exploring
            </button>
            <button
              id="cta-owner-btn"
              className="px-8 py-3.5 bg-transparent text-white/80 border border-white/20 rounded-full text-sm font-medium hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-300"
            >
              List Your Property
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="py-12 bg-white border-t border-outline/50" id="footer">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-7 h-7">
                <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
                  <path d="M18 4 L28 16 L26 18 L10 18 L8 16 Z" fill="#004D40" />
                  <rect x="11" y="18" width="14" height="12" rx="2" fill="#004D40" opacity="0.85" />
                  <rect x="15" y="22" width="6" height="8" rx="1" fill="#FFC107" />
                </svg>
              </div>
              <span className="text-sm font-serif text-primary">PG Genie</span>
            </div>
            <div className="flex items-center gap-8 text-xs text-on-surface/60">
              <a href="/explore" className="hover:text-primary transition-colors">Explore PGs</a>
              <a href="/owner" className="hover:text-primary transition-colors">List Your Property</a>
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
            </div>
            <p className="text-xs text-on-surface/40">
              © 2026 PG Genie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─────────────────── Sub-components ─────────────────── */

function QuickStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xl md:text-2xl font-serif text-primary">{value}</span>
      <span className="text-[11px] text-on-surface/60 font-medium tracking-wider uppercase mt-0.5">
        {label}
      </span>
    </div>
  );
}

function FeatureCardPremium({
  icon,
  title,
  subtitle,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  index: number;
}) {
  return (
    <div
      className="m3-card-premium p-8 group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-primary/[0.06] flex items-center justify-center text-primary mb-6 group-hover:bg-primary/10 transition-colors duration-300">
        {icon}
      </div>

      {/* Title */}
      <h3 className="headline-serif text-primary text-2xl mb-1">{title}</h3>
      <p className="text-xs font-medium text-accent tracking-wider uppercase mb-4">
        {subtitle}
      </p>

      {/* Description — very little text */}
      <p className="text-body text-on-surface/70 text-sm leading-relaxed">
        {description}
      </p>

      {/* Subtle arrow */}
      <div className="mt-6 flex items-center gap-1 text-primary/40 group-hover:text-primary transition-colors duration-300">
        <span className="text-xs font-medium">Learn more</span>
        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </div>
  );
}

function PropertyCardPremium({
  title,
  type,
  location,
  price,
  amenities,
  tag,
  imageGradient,
  index,
}: {
  title: string;
  type: string;
  location: string;
  price: string;
  amenities: string[];
  tag?: string;
  imageGradient: string;
  index: number;
}) {
  return (
    <div
      className="m3-card-premium group cursor-pointer"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Image placeholder — elegant gradient with icon */}
      <div className={`relative h-52 bg-gradient-to-br ${imageGradient} flex items-center justify-center overflow-hidden`}>
        {/* Architectural pattern overlay */}
        <div className="absolute inset-0 grid-architectural opacity-30" />

        <Bed
          size={48}
          className="text-primary/20 group-hover:text-primary/30 transition-colors duration-500 group-hover:scale-110 transform"
          strokeWidth={1}
        />

        {/* Tag badge */}
        {tag && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-primary tracking-wider uppercase border border-outline/30">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {tag}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Type label */}
        <p className="text-[10px] font-semibold text-accent tracking-[0.15em] uppercase mb-2">
          {type}
        </p>

        <h3 className="headline-serif text-primary text-xl mb-2">{title}</h3>

        <p className="text-body text-on-surface/60 text-xs mb-5 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location}
        </p>

        {/* Amenity pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {amenities.map((amenity) => (
            <span
              key={amenity}
              className="px-3 py-1 bg-surface-dim text-on-surface/60 text-[10px] font-medium rounded-full tracking-wide"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-outline/40">
          <div>
            <span className="text-xl font-serif text-primary">{price}</span>
            <span className="text-[10px] text-on-surface/40 ml-1">/month</span>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-medium rounded-full hover:bg-primary-dark transition-all duration-300 hover:shadow-md active:scale-[0.97]">
            View
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
