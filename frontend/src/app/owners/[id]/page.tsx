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
              {/* Owner Hero Card */}
              <div className="bg-surface-container-low rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-variant flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-container/30 rounded-full blur-2xl -ml-12 -mb-12"></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-sm mb-4">
                  <img alt="Owner Portrait" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF0RP1jRlDbx4gTPKxEWSDtNVZk7bZRqtLLyxqHWp3dd-pYRJL6yb3YvflKrmR6F8xZ3U1lQRHZHmrH6Y1vgcl2CyFWDHodALiSRBdJY3qvdPTvmQ2BUNBO9lFfy_cUHtPECowDtVMPq19lwX_jNMmA5TaVagjYYMyXN7UidNTtBdN852kATEdaqcgWje_IjvaIJ5l6oGaZToE75Jaga5Lj4PgoCbPahbEnNsLR3EirHkAkGUtLpzaw1X2NxFBeNeB-VMe2XhfCvU9" />
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
