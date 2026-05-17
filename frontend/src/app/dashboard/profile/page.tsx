"use client";
import React, from 'react';
import Link from 'next/link';

export default function StudentProfilePage() {
  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="w-full sticky top-0 z-40 shadow-sm bg-surface">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
          <span className="font-display text-h2 font-extrabold text-primary cursor-default">PG Genie</span>
          
          {/* Mobile nav icons placeholder */}
          <div className="flex items-center gap-4 md:hidden text-primary">
            <span className="material-symbols-outlined hover:bg-primary-container/10 transition-colors p-2 rounded-full cursor-pointer transition-all duration-300">notifications</span>
            <span className="material-symbols-outlined text-primary font-bold border-b-2 border-primary p-2 cursor-pointer transition-all duration-300">account_circle</span>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6 text-on-surface-variant">
            <span className="material-symbols-outlined hover:bg-primary-container/10 transition-colors p-2 rounded-full cursor-pointer opacity-80 hover:scale-95 transition-all duration-300">notifications</span>
            <span className="material-symbols-outlined text-primary font-bold border-b-2 border-primary p-2 cursor-pointer transition-all duration-300">account_circle</span>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto py-stack-lg">
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 font-label-sm md:hidden">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Dashboard
        </Link>
        
        {/* Profile Header Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-lg">
          {/* User Avatar & Identity Card */}
          <div className="col-span-1 md:col-span-1 bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative mb-stack-sm">
              <img alt="Student Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXrAjm40r7CI_p5nCOXKe6f7C6Aw1SzjXxlgcqORzwtPPosc_bnkKkgspjRlovZQqlYB5zamWweDm81lNmgIWShPFQNKnTjFDRsU1TPKywmlDnEFOBxja2zyzwvjZ4faB0_c4jUh7KOidKLn2sd6QriFD3pZgxjM8edb-pTg4fe372K0tUdiupeVfqrb0j6hqZIQWsi-5cCksuFZBmusQdIuq9qAAuBRvFY28UaT0sBL1OyViYegXZxxc2Xg8qWDMNeVXlb2eBWKwZ"/>
              <button className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-2 shadow-sm hover:scale-95 transition-transform cursor-pointer">
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</span>
              </button>
            </div>
            <h1 className="font-h1 text-h1 text-on-background mb-1">Aarav Sharma</h1>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center justify-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>school</span>
              VIT Bhopal
            </p>
            <div className="mt-4 inline-block bg-primary-container/10 text-primary rounded-full px-4 py-1 font-label-sm text-label-sm">
              Batch of 2026
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="col-span-1 md:col-span-2 bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col justify-between">
            <div>
              <h2 className="font-h2 text-h2 text-on-background flex items-center gap-2 mb-stack-sm">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
                Document Verification
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">Complete your profile to unlock instant bookings and connect with verified owners.</p>
            </div>
            <div className="space-y-4">
              {/* Aadhar Status */}
              <div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-surface-variant transition-all duration-300 cursor-pointer hover:bg-surface-container-low hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 p-2 rounded-full text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined">credit_card</span>
                  </div>
                  <div>
                    <h3 className="font-body-lg text-body-lg font-bold text-on-background">Aadhar Card</h3>
                    <p className="font-label-sm text-label-sm text-secondary">Verified</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary">check_circle</span>
              </div>
              
              {/* Student ID Status */}
              <div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-outline-variant transition-all duration-300 cursor-pointer hover:bg-surface-container-low hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="bg-surface-variant p-2 rounded-full text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined">badge</span>
                  </div>
                  <div>
                    <h3 className="font-body-lg text-body-lg font-bold text-on-background">Student ID</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Pending Upload</p>
                  </div>
                </div>
                <button className="bg-primary-container/10 text-primary hover:bg-primary-container hover:text-on-primary px-4 py-2 rounded-full font-label-sm text-label-sm transition-colors border border-primary cursor-pointer">
                  Upload Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <h2 className="font-h2 text-h2 text-on-background mb-stack-md">Accommodation Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
          {/* Budget Range */}
          <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-2 mb-stack-sm text-primary">
              <span className="material-symbols-outlined">payments</span>
              <h3 className="font-body-lg text-body-lg font-bold text-on-background">Monthly Budget</h3>
            </div>
            <div className="mt-stack-sm">
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-2">
                <span>₹4,000</span>
                <span>₹12,000+</span>
              </div>
              {/* Custom Range Slider Visual */}
              <div className="relative w-full h-2 bg-surface-variant rounded-full mt-4">
                <div className="absolute top-0 left-1/4 right-1/4 h-full bg-primary rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-primary rounded-full shadow border-2 border-surface transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-primary rounded-full shadow border-2 border-surface transform translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <p className="font-body-md text-body-md text-center mt-4 font-bold text-primary">₹6,000 - ₹9,000</p>
            </div>
          </div>

          {/* Room Type */}
          <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-2 mb-stack-sm text-primary">
              <span className="material-symbols-outlined">bed</span>
              <h3 className="font-body-lg text-body-lg font-bold text-on-background">Preferred Room Type</h3>
            </div>
            <div className="flex flex-col gap-3 mt-stack-sm">
              <label className="flex items-center justify-between p-3 rounded-lg border border-primary bg-primary-container/5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <span className="font-body-md text-body-md text-on-background">Single Room</span>
                </div>
                <input defaultChecked className="text-primary focus:ring-primary h-5 w-5 border-outline-variant" name="room_type" type="radio" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">group</span>
                  <span className="font-body-md text-body-md text-on-background">Shared Room (2-3)</span>
                </div>
                <input className="text-primary focus:ring-primary h-5 w-5 border-outline-variant" name="room_type" type="radio" />
              </label>
            </div>
          </div>
          {/* Dietary Preferences */}
          <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-2 mb-stack-sm text-primary">
              <span className="material-symbols-outlined">restaurant</span>
              <h3 className="font-body-lg text-body-lg font-bold text-on-background">Dietary Preference</h3>
            </div>
            <div className="flex flex-wrap gap-3 mt-stack-sm">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-secondary bg-secondary/10 text-secondary font-label-sm text-label-sm transition-all duration-300 hover:scale-105 hover:shadow-sm cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                Veg
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface transition-all duration-300 hover:scale-105 hover:shadow-sm cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                Non-Veg
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface transition-all duration-300 hover:scale-105 hover:shadow-sm cursor-pointer">
                <div className="w-3 h-3 rounded-full border-2 border-outline-variant"></div>
                Any
              </button>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-4 text-sm">Helps us recommend PGs with suitable mess facilities.</p>
          </div>
        </div>

        <div className="mt-stack-lg flex justify-end">
          <button className="bg-primary text-on-primary hover:bg-primary-container px-8 py-3 rounded-lg font-body-lg text-body-lg font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-1 hover:shadow-[0px_8px_30px_rgba(76,29,149,0.2)] cursor-pointer">
            Save Preferences
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-stack-lg bg-surface-container-highest border-t border-outline-variant">
        <div className="w-full py-stack-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-stack-md">
          <div>
            <div className="font-display text-h1 text-primary mb-2">PG Genie</div>
            <p className="font-body-md text-body-md text-on-surface-variant">© 2026 PG Genie. Dedicated to VIT Bhopal Community.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors transition-all duration-300 hover:translate-x-1" href="#">About Kothri</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors transition-all duration-300 hover:translate-x-1" href="/owner/dashboard">Owner Dashboard</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors transition-all duration-300 hover:translate-x-1" href="#">Help Center</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors transition-all duration-300 hover:translate-x-1" href="#">Privacy Policy</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors transition-all duration-300 hover:translate-x-1" href="#">Contact Support</Link>
          </div>
        </div>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container shadow-[0px_-4px_20px_rgba(76,29,149,0.05)] rounded-t-xl md:hidden">
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary" href="/pgs">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-sm text-label-sm mt-1">Search</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary" href="/dashboard/saved">
          <span className="material-symbols-outlined">favorite</span>
          <span className="font-label-sm text-label-sm mt-1">Saved</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary" href="/dashboard/bookings">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-label-sm text-label-sm mt-1">Bookings</span>
        </Link>
        <Link className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-5 py-1 scale-90 transition-all duration-200" href="/dashboard/profile">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
          <span className="font-label-sm text-label-sm mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
