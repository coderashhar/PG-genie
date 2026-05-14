import React from 'react';
import Link from 'next/link';

export default function OwnerProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="w-full sticky top-0 z-40 bg-surface shadow-sm">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
          <Link className="font-display text-h2 font-extrabold text-primary transition-colors duration-300" href="/">PG Genie</Link>
          <div className="hidden md:flex items-center gap-6">
            <Link className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1 transition-colors duration-300 cursor-pointer" href="/pgs">Explore</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:bg-primary-container/10 px-3 py-2 rounded-lg transition-colors duration-300 hover:text-primary cursor-pointer" href="#">Saved</Link>
          </div>
          <div className="flex items-center gap-4 text-primary font-body-md text-body-md">
            <button className="hover:bg-primary-container/10 transition-colors p-2 rounded-full cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hover:bg-primary-container/10 transition-colors p-2 rounded-full cursor-pointer">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-lg">
        {/* Bento Grid Layout for Owner Profile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md">
          {/* Left Column: Owner Hero & Stats (Sticky on Desktop) */}
          <div className="md:col-span-4 flex flex-col gap-stack-md">
            <div className="sticky top-[88px] flex flex-col gap-stack-md">
              {/* Owner Hero Card Placeholder */}
              
              {/* Stats Card Placeholder */}
            </div>
          </div>

          {/* Right Column: Listings & Reviews */}
          <div className="md:col-span-8 flex flex-col gap-stack-lg">
            {/* Owner's Listings Section Placeholder */}
            
            {/* Reviews Section Placeholder */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-stack-lg bg-surface-container-highest border-t border-outline-variant">
        <div className="w-full py-stack-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-stack-md">
          <div className="flex flex-col gap-4">
            <span className="font-display text-h1 text-primary">PG Genie</span>
            <p className="font-body-md text-body-md text-on-surface-variant">© 2026 PG Genie. Dedicated to VIT Bhopal Community.</p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8 items-center font-body-md text-body-md">
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-300 cursor-pointer" href="#">About Kothri</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-300 cursor-pointer" href="/owner/dashboard">Owner Dashboard</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-300 cursor-pointer" href="#">Help Center</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-300 cursor-pointer" href="#">Privacy Policy</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-300 cursor-pointer" href="#">Contact Support</Link>
          </div>
        </div>
      </footer>

      {/* BottomNavBar for Mobile (Visible only on md:hidden) */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container shadow-[0px_-4px_20px_rgba(76,29,149,0.05)] md:hidden">
        <div className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe">
          <Link className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-5 py-1 scale-90 transition-all duration-200 cursor-pointer" href="/pgs">
            <span className="material-symbols-outlined">search</span>
            <span className="font-label-sm text-label-sm mt-1">Search</span>
          </Link>
          <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer" href="#">
            <span className="material-symbols-outlined">favorite</span>
            <span className="font-label-sm text-label-sm mt-1">Saved</span>
          </Link>
          <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer" href="#">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-label-sm text-label-sm mt-1">Bookings</span>
          </Link>
          <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer" href="/dashboard/profile">
            <span className="material-symbols-outlined">person</span>
            <span className="font-label-sm text-label-sm mt-1">Profile</span>
          </Link>
        </div>
        {/* Spacer to prevent content from hiding behind fixed nav on mobile */}
        <div className="h-20"></div>
      </nav>
      <div className="md:hidden h-20"></div>
    </div>
  );
}
