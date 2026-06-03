"use client";
import React from 'react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function OwnerProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-lg">
        {/* Back Button */}
        <Link href="/pgs" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 font-label-sm">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Search
        </Link>
        {/* Bento Grid Layout for Owner Profile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md">
          {/* Left Column: Owner Hero & Stats (Sticky on Desktop) */}
          <div className="md:col-span-4 flex flex-col gap-stack-md">
            <div className="sticky top-[88px] flex flex-col gap-stack-md">
              {/* Owner Hero Card */}
              <div className="bg-surface-container-low rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-variant flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-container/30 rounded-full blur-2xl -ml-12 -mb-12"></div>
                <div className="relative mb-4">
                  <ImageUpload
                    shape="circle"
                    defaultImage="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                    onUploadSuccess={(url) => console.log("Owner avatar uploaded:", url)}
                    label="Avatar"
                  />
                </div>
                <h1 className="font-h1 text-h1 text-on-surface mb-1">Ramesh Sharma</h1>
                <div className="flex items-center gap-2 mb-4 transition-transform duration-300 hover:scale-105 cursor-default">
                  <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="font-body-md text-body-md text-secondary font-semibold">Verified Partner</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-sm">Providing safe and comfortable homes in Kothri for VIT students since 2018.</p>
                <button className="w-full bg-secondary text-on-secondary font-label-sm text-label-sm py-3 px-4 rounded-lg shadow-sm hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined text-lg">chat</span>
                  Contact Owner
                </button>
              </div>
              
              {/* Stats Card */}
              <div className="bg-surface-container-low rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-variant">
                <h2 className="font-h2 text-h2 text-on-surface mb-4">Trust Metrics</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">Average Rating</span>
                    </div>
                    <span className="font-h2 text-h2 text-primary">4.8<span className="text-sm text-on-surface-variant">/5</span></span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined">group</span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">Students Hosted</span>
                    </div>
                    <span className="font-h2 text-h2 text-secondary">120+</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined">calendar_month</span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">Years on Platform</span>
                    </div>
                    <span className="font-h2 text-h2 text-on-surface">6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Listings & Reviews */}
          <div className="md:col-span-8 flex flex-col gap-stack-lg">
            {/* Owner's Listings Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-h1 text-h1 text-on-surface">Properties in Kothri</h2>
                <span className="bg-primary-container/10 text-primary font-label-sm text-label-sm px-3 py-1 rounded-full">3 Active Listings</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
                {/* Listing Card 1 */}
                <Link href="/pgs/123" className="bg-surface rounded-xl overflow-hidden shadow-sm border border-surface-variant group flex flex-col transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20 block cursor-pointer">
                  <div className="relative h-48 w-full overflow-hidden">
                    <ImageUpload
                      defaultImage="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
                      onUploadSuccess={(url) => console.log('Property 1 image uploaded:', url)}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 right-3 bg-secondary text-on-secondary font-label-sm text-label-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm cursor-default pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-on-secondary animate-pulse"></span>
                      Rooms Available
                    </div>
                  </div>
                  <div className="p-gutter flex flex-col flex-grow">
                    <h3 className="font-h2 text-h2 text-on-surface mb-1">Sharma Boys Residency</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      Near VIT Main Gate, Kothri
                    </p>
                    <div className="flex flex-wrap gap-2 mb-stack-md">
                      <span className="bg-primary/5 text-primary font-label-sm text-label-sm px-2 py-1 rounded-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">wifi</span> Free WiFi
                      </span>
                      <span className="bg-primary/5 text-primary font-label-sm text-label-sm px-2 py-1 rounded-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">restaurant</span> Mess Included
                      </span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-surface-variant flex items-center justify-between">
                      <div>
                        <span className="font-h2 text-h2 text-primary">₹6,500</span>
                        <span className="font-body-md text-body-md text-on-surface-variant text-xs">/month</span>
                      </div>
                      <button className="border-[1.5px] border-primary text-primary font-label-sm text-label-sm px-4 py-2 rounded-lg transition-colors duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
                {/* Listing Card 2 */}
                <Link href="/pgs/456" className="bg-surface rounded-xl overflow-hidden shadow-sm border border-surface-variant group flex flex-col transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20 block cursor-pointer">
                  <div className="relative h-48 w-full overflow-hidden">
                    <ImageUpload
                      defaultImage="https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?w=800&q=80"
                      onUploadSuccess={(url) => console.log('Property 2 image uploaded:', url)}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 right-3 bg-tertiary text-on-tertiary font-label-sm text-label-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm cursor-default pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-on-tertiary"></span>
                      Filling Fast
                    </div>
                  </div>
                  <div className="p-gutter flex flex-col flex-grow">
                    <h3 className="font-h2 text-h2 text-on-surface mb-1">Sharma Premium Block</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      Market Road, Kothri
                    </p>
                    <div className="flex flex-wrap gap-2 mb-stack-md">
                      <span className="bg-primary/5 text-primary font-label-sm text-label-sm px-2 py-1 rounded-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">ac_unit</span> AC Rooms
                      </span>
                      <span className="bg-primary/5 text-primary font-label-sm text-label-sm px-2 py-1 rounded-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">local_laundry_service</span> Laundry
                      </span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-surface-variant flex items-center justify-between">
                      <div>
                        <span className="font-h2 text-h2 text-primary">₹8,000</span>
                        <span className="font-body-md text-body-md text-on-surface-variant text-xs">/month</span>
                      </div>
                      <button className="border-[1.5px] border-primary text-primary font-label-sm text-label-sm px-4 py-2 rounded-lg transition-colors duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
            {/* Reviews Section */}
            <section>
              <h2 className="font-h1 text-h1 text-on-surface mb-6">Student Testimonials</h2>
              <div className="flex flex-col gap-4">
                {/* Review Card 1 */}
                <div className="bg-surface rounded-xl p-6 shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-variant relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:bg-surface-container-low">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary-container/10 rounded-bl-full z-0"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-h2 text-h2">A</div>
                        <div>
                          <h4 className="font-body-md text-body-md font-semibold text-on-surface">Aditya Verma</h4>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">CSE, 3rd Year • Stayed 2 years</p>
                        </div>
                      </div>
                      <div className="flex text-primary">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">&quot;Ramesh uncle is very cooperative. The mess food is actually good compared to other places in Kothri. Any maintenance issue is resolved within a day. Highly recommend the main gate residency.&quot;</p>
                  </div>
                </div>
                {/* Review Card 2 */}
                <div className="bg-surface rounded-xl p-6 shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-variant relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:bg-surface-container-low">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary-container/10 rounded-bl-full z-0"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-h2 text-h2">R</div>
                        <div>
                          <h4 className="font-body-md text-body-md font-semibold text-on-surface">Rahul K.</h4>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">ECE, 2nd Year • Current Resident</p>
                        </div>
                      </div>
                      <div className="flex text-primary">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm">star_half</span>
                      </div>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">&quot;The premium block is very peaceful for studying. WiFi speed is decent most of the time. Owner is strict about timings which is good for security but sometimes slightly inconvenient.&quot;</p>
                  </div>
                </div>
              </div>
              <button className="mt-6 text-primary font-label-sm text-label-sm hover:underline flex items-center gap-1 mx-auto cursor-pointer">
                View All 42 Reviews <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
