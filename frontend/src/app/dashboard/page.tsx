"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function StudentDashboardPage() {
  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased md:flex min-h-screen">
      {/* TopNavBar (Mobile Only) */}
      <Navbar className="md:hidden sticky top-0 z-40 shadow-sm bg-surface text-primary" />


      {/* SideNavBar (Web Only) */}
      <aside className="hidden md:flex h-full w-72 left-0 top-0 fixed z-50 bg-surface shadow-xl flex-col p-gutter">
        <div className="mb-stack-lg">
          <span className="font-display text-h2 text-primary mb-2 block cursor-default">PG Genie</span>
          <Link href="/dashboard/profile" className="flex items-center gap-4 mt-stack-md p-4 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-h2 group-hover:scale-105 transition-transform">A</div>
            <div>
              <h2 className="font-h2 text-h2 text-on-surface group-hover:text-primary transition-colors">Student Portal</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">VIT Bhopal student</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <Link className="flex items-center gap-4 p-3 bg-primary-container text-on-primary-container font-semibold rounded-lg group cursor-pointer" href="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link className="flex items-center gap-4 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg group cursor-pointer" href="/">
            <span className="material-symbols-outlined">public</span>
            <span>Home Page</span>
          </Link>
          <Link className="flex items-center gap-4 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg group cursor-pointer" href="#">
            <span className="material-symbols-outlined">list_alt</span>
            <span>My Listings</span>
          </Link>
          <Link className="flex items-center gap-4 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg group cursor-pointer" href="#">
            <span className="material-symbols-outlined">payments</span>
            <span>Payment History</span>
          </Link>
          <Link className="flex items-center gap-4 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg group cursor-pointer" href="#">
            <span className="material-symbols-outlined">help_outline</span>
            <span>Support</span>
          </Link>
        </nav>
        <div className="mt-auto">
          <button className="w-full bg-primary text-on-primary font-body-lg text-body-lg py-3 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">List your PG</button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <div className="flex-1 w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto py-stack-md md:py-stack-lg">
          {/* Header Section */}
          <header className="mb-stack-lg">
            <h1 className="font-display text-display text-primary mb-2">Welcome back, Aryan</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Here is an overview of your housing search.</p>
          </header>

          {/* Dashboard Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
            {/* Main Column (Saved PGs & Applications) */}
            <div className="lg:col-span-2 flex flex-col gap-stack-lg">
              
              {/* Saved PGs */}
              <section>
                <div className="flex justify-between items-center mb-stack-md">
                  <h2 className="font-h1 text-h1 text-on-surface">Saved PGs</h2>
                  <button className="text-primary hover:text-primary-fixed-dim hover:translate-x-1 transition-all duration-300 font-label-sm text-label-sm flex items-center gap-1 cursor-pointer">
                    View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  {/* Card 1 */}
                  <Link href="/pgs/64a2b3c9" className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] overflow-hidden border border-surface-container hover:shadow-xl hover:scale-[1.02] hover:border-primary-container transition-all duration-300 group cursor-pointer flex flex-col block">
                    <div className="relative w-full aspect-video">
                      <img alt="Modern student apartment interior" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwRCscT_RSHrWh37dWQgDImnpm4gqzEA8vb6OP6nWaX6lrifReLCpTTGwDdbrwI0dUSBatLL03qx_Dxe_xUzrrGQ0Hg65bgdahXprFX-2X6Pn-kChn7DpLyDJeOuYNnsW-TYkFngLpmP-UVQxcPHmszejrBtDF2U6KUHITpzEjhraY6aw6vWljTj_hpQWh2R5UtDXFBpIZ2q5uZeRj5UlXuZA8ordx-0TtOXXTZhDbbMNNTX6XAbzLOZIi7hyTKU_TgA8i24akBzVc" />
                      <div className="absolute top-3 right-3 bg-surface text-secondary px-2 py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-xs">verified</span> Verified
                      </div>
                      <button className="absolute top-3 left-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-surface transition-colors cursor-pointer" onClick={(e) => e.preventDefault()}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-h2 text-h2 text-on-surface mb-1 group-hover:text-primary transition-colors">Sunrise Student Housing</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mb-3">
                        <span className="material-symbols-outlined text-sm">location_on</span> 1.2 km from VIT Bhopal
                      </p>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        <span className="bg-primary-container/5 text-primary px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-xs">wifi</span> WiFi</span>
                        <span className="bg-primary-container/5 text-primary px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-xs">ac_unit</span> AC</span>
                        <span className="bg-primary-container/5 text-primary px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-xs">local_laundry_service</span> Laundry</span>
                      </div>
                      <div className="mt-auto pt-4 border-t border-surface-container flex justify-between items-center">
                        <div>
                          <span className="font-h2 text-h2 text-primary">₹6,500</span>
                          <span className="font-body-md text-body-md text-on-surface-variant">/mo</span>
                        </div>
                        <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-primary-container transition-colors cursor-pointer" onClick={(e) => e.preventDefault()}>View Details</button>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Card 2 */}
                  <Link href="/pgs/8f7e6d5c" className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] overflow-hidden border border-surface-container hover:shadow-xl hover:scale-[1.02] hover:border-primary-container transition-all duration-300 group cursor-pointer flex flex-col block">
                    <div className="relative w-full aspect-video">
                      <img alt="Cozy student dorm room" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7vNiqW4BascszDw9GIhPJsqgINESp787lbHCZgrmMxdBwHbXIymSqvwSgklKRjsbFqHkzi7xr7AN_FKH9AfWavz79urmqHLqBj1ppj3vaS_q0bIzig29J8wAWSxb4xXL18OwDEIf7VLY3va7d-dr5WVwpnUmULYXv6B9uKu4g3-6sCJQkcNEI0crOp2xavKAnxOe0HLhiUL9KylgwfEpcYU-HdtAQ71gLeQ7yYUy_WIBMVENFKr-PLohycnRv24uoWTw4aQI7M5aJ" />
                      <div className="absolute top-3 right-3 bg-surface text-secondary px-2 py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-xs">verified</span> Verified
                      </div>
                      <button className="absolute top-3 left-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-surface transition-colors cursor-pointer" onClick={(e) => e.preventDefault()}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-h2 text-h2 text-on-surface mb-1 group-hover:text-primary transition-colors">Kothri Boys Hostel</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mb-3">
                        <span className="material-symbols-outlined text-sm">location_on</span> 0.8 km from VIT Bhopal
                      </p>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        <span className="bg-primary-container/5 text-primary px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-xs">wifi</span> WiFi</span>
                        <span className="bg-primary-container/5 text-primary px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-xs">restaurant</span> Meals</span>
                      </div>
                      <div className="mt-auto pt-4 border-t border-surface-container flex justify-between items-center">
                        <div>
                          <span className="font-h2 text-h2 text-primary">₹5,000</span>
                          <span className="font-body-md text-body-md text-on-surface-variant">/mo</span>
                        </div>
                        <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-primary-container transition-colors cursor-pointer" onClick={(e) => e.preventDefault()}>View Details</button>
                      </div>
                    </div>
                  </Link>
                </div>
              </section>

              {/* Applied PGs */}
              <section>
                <h2 className="font-h1 text-h1 text-on-surface mb-stack-md">Applied PGs</h2>
                <div className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container overflow-hidden">
                  <ul className="divide-y divide-surface-container">
                    <Link href="/pgs/1a2b3c4d" className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container transition-colors cursor-pointer block">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img alt="PG Thumbnail" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR6jZKxmsR55IQXDw4gtdv9rwAWdT8xnDWPHLhTy3kI8LLHJ_Yfg5hINAYpqoUY8_4upKiV9MLsch2vKFHPcnFxFyEZ_qc1MWrqpzlmjQ7dr2v0xsVbNMb47rZ7kUkt4Sof6_XeEVIFJQCUSUQ354m7_QT7Hmkz7Vvfn1ULCjfh0-M9eBEMTs4hFX8xZx3xHU2n22Ex0IKd9iiO1leoaes8uSbwF1hjj1Z2WI4snXiRefszrOmIKseYI5d4hJnucP2RT9KR_zFMfYW" />
                        </div>
                        <div>
                          <h3 className="font-h2 text-h2 text-on-surface">Green Valley Residency</h3>
                          <p className="font-body-md text-body-md text-on-surface-variant">Applied on Oct 12, 2026</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">pending</span> Pending
                        </span>
                        <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer" onClick={(e) => e.preventDefault()}>
                          <span className="material-symbols-outlined text-sm">more_vert</span>
                        </button>
                      </div>
                    </Link>
                    
                    <Link href="/pgs/9f8e7d6c" className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container transition-colors cursor-pointer block">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img alt="PG Thumbnail" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9PDDOpUrPDk5UhB4RPpt-kmlZUoeRYzSRLUc0TUKV8kL2QvcF7SO8A0v1EuUdOa8EtrkXkVJED3Hi1HqZwB1JQQl9B04KNXTHQGF2eNaYscGlrNlxZCyYsNRg-FXzkK5sJg2RLCpaBH0smEBMt0fmqN7D97vbZ3sTkKq1aCFIVr54hncPZ45vGQlwUHwKqhyK5RjTTHXToFvHylTkfVrtV3d-rT9kF4M7M3Y4e4ZgvSEVryQKOndaypjmoda9svAkVCj7O3ODEViG" />
                        </div>
                        <div>
                          <h3 className="font-h2 text-h2 text-on-surface">Shanti Niwas</h3>
                          <p className="font-body-md text-body-md text-on-surface-variant">Applied on Oct 05, 2026</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check_circle</span> Approved
                        </span>
                        <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer" onClick={(e) => e.preventDefault()}>
                          <span className="material-symbols-outlined text-sm">more_vert</span>
                        </button>
                      </div>
                    </Link>
                  </ul>
                </div>
              </section>
            </div>

            {/* Side Column (Recent Visits & Activity) */}
            <div className="flex flex-col gap-stack-lg">
              {/* Recent Visits Scheduled */}
              <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
                <h2 className="font-h2 text-h2 text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">event_available</span>
                  Upcoming Visits
                </h2>
                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-surface-container">
                  {/* Visit Item 1 */}
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10">
                      <div className="w-2 h-2 bg-on-secondary rounded-full"></div>
                    </div>
                    <div className="bg-surface border border-surface-container rounded-lg p-3 hover:border-secondary transition-colors cursor-pointer">
                      <p className="font-label-sm text-label-sm text-secondary mb-1">Today, 4:00 PM</p>
                      <h4 className="font-h2 text-body-lg text-on-surface mb-2">Sunrise Student Housing</h4>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-surface-container text-primary py-1.5 rounded-md font-label-sm text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-colors text-center cursor-pointer">Reschedule</button>
                        <button className="w-10 bg-secondary text-on-secondary rounded-md flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer">
                          <span className="material-symbols-outlined text-sm">call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visit Item 2 */}
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container border-2 border-outline-variant flex items-center justify-center shadow-sm z-10">
                    </div>
                    <div className="bg-surface border border-surface-container rounded-lg p-3 hover:border-primary-container transition-colors opacity-70 cursor-pointer">
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Oct 26, 11:00 AM</p>
                      <h4 className="font-h2 text-body-lg text-on-surface mb-2">Elite Boys PG</h4>
                      <div className="flex gap-2">
                        <button className="flex-1 border border-outline-variant text-on-surface-variant py-1.5 rounded-md font-label-sm text-label-sm hover:bg-surface-container transition-colors text-center cursor-pointer">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 text-primary font-label-sm text-label-sm py-2 hover:bg-primary-container/5 hover:text-primary-fixed-dim hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">View All Schedule</button>
              </section>
              
              {/* Quick Actions Widget */}
              <section className="bg-primary text-on-primary rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                <h3 className="font-h2 text-h2 mb-2 relative z-10">Need Help Finding a PG?</h3>
                <p className="font-body-md text-body-md text-primary-fixed-dim mb-4 relative z-10">Tell us your requirements and we&apos;ll send you curated recommendations.</p>
                <button className="w-full bg-secondary text-on-secondary font-label-sm text-label-sm py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity relative z-10 flex justify-center items-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined text-sm">magic_button</span> Get Recommendations
                </button>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full mt-auto bg-surface-container-highest border-t border-outline-variant">
          <div className="w-full py-stack-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-stack-md">
            <div className="flex flex-col gap-4">
              <span className="font-display text-h1 text-primary">PG Genie</span>
              <span className="font-body-md text-body-md text-on-surface-variant">© 2026 PG Genie. Dedicated to VIT Bhopal Community.</span>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8 items-center">
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">About Kothri</Link>
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="/owner/dashboard">Owner Dashboard</Link>
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Help Center</Link>
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Privacy Policy</Link>
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Contact Support</Link>
            </div>
          </div>
        </footer>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container shadow-[0px_-4px_20px_rgba(76,29,149,0.05)] left-0 flex justify-around items-center px-4 py-3 pb-safe">
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary group transition-all duration-200 cursor-pointer" href="/pgs">
          <span className="material-symbols-outlined mb-1">search</span>
          <span className="font-label-sm text-label-sm">Search</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary group transition-all duration-200 cursor-pointer" href="#">
          <span className="material-symbols-outlined mb-1">favorite</span>
          <span className="font-label-sm text-label-sm">Saved</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary group transition-all duration-200 cursor-pointer" href="#">
          <span className="material-symbols-outlined mb-1">receipt_long</span>
          <span className="font-label-sm text-label-sm">Bookings</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary group transition-all duration-200 cursor-pointer" href="/dashboard/profile">
          <span className="material-symbols-outlined mb-1">person</span>
          <span className="font-label-sm text-label-sm">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
