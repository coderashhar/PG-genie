"use client";
import React, from 'react';
import Link from 'next/link';

export default function StudentProfilePage() {
  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="w-full sticky top-0 z-40 shadow-sm bg-surface">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
          <div className="font-display text-h2 font-extrabold text-primary">PG Genie</div>
          
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
        {/* We will add profile content here */}
        <h1 className="font-display text-display mb-stack-md text-primary">Profile</h1>
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
