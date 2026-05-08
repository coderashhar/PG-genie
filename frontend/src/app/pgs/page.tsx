import React from 'react';
import Link from 'next/link';

export default function PgsPage() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="w-full sticky top-0 z-40 bg-surface dark:bg-on-background shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
          <Link href="/" className="font-display text-h2 font-extrabold text-primary dark:text-primary-fixed-dim">
            PG Genie
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link className="font-body-md text-body-md text-primary dark:text-primary-fixed-dim font-bold border-b-2 border-primary h-16 flex items-center" href="/pgs">Search</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10 transition-colors h-16 flex items-center px-4 rounded" href="#">Saved</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10 transition-colors h-16 flex items-center px-4 rounded" href="#">Bookings</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10 transition-colors h-16 flex items-center px-4 rounded" href="#">Profile</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-surface-container-high rounded-full px-4 py-2 items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-body-md w-48 text-on-surface outline-none" placeholder="Search Kothri..." type="text" />
            </div>
            <button className="p-2 text-primary dark:text-primary-fixed-dim hover:bg-primary-container/10 transition-colors rounded-full cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-primary dark:text-primary-fixed-dim hover:bg-primary-container/10 transition-colors rounded-full cursor-pointer">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-lg flex flex-col md:flex-row gap-stack-lg">
        {/* Left Sidebar: Filters */}
        <aside className="w-full md:w-72 flex-shrink-0 space-y-stack-md hidden md:block">
          <div className="bg-surface-container-low rounded-xl p-6 shadow-sm border border-outline-variant/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-h2 text-h2 text-on-surface">Filters</h2>
              <button className="text-primary font-body-md text-body-md hover:underline cursor-pointer">Clear all</button>
            </div>

            {/* Price Range */}
            <div className="mb-stack-md">
              <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Price Range (Monthly)</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
                  <span className="font-body-md text-body-md text-on-surface-variant">Under ₹5,000</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input defaultChecked className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
                  <span className="font-body-md text-body-md text-on-surface-variant">₹5,000 - ₹8,000</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
                  <span className="font-body-md text-body-md text-on-surface-variant">₹8,000 - ₹12,000</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input className="form-radio text-primary focus:ring-primary h-5 w-5 border-outline" name="price" type="radio" />
                  <span className="font-body-md text-body-md text-on-surface-variant">Above ₹12,000</span>
                </label>
              </div>
            </div>

            <hr className="border-outline-variant/50 mb-stack-md" />

            {/* Gender */}
            <div className="mb-stack-md">
              <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Gender Focus</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-full border border-primary bg-primary-container/10 text-primary font-body-md text-body-md cursor-pointer">Boys</button>
                <button className="px-4 py-2 rounded-full border border-outline bg-surface text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors cursor-pointer">Girls</button>
                <button className="px-4 py-2 rounded-full border border-outline bg-surface text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors cursor-pointer">Co-ed</button>
              </div>
            </div>

            <hr className="border-outline-variant/50 mb-stack-md" />

            {/* Facilities */}
            <div className="mb-stack-md">
              <h3 className="font-body-lg text-body-lg font-semibold mb-stack-sm text-on-surface">Facilities</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input defaultChecked className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">wifi</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">High-Speed WiFi</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">ac_unit</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Air Conditioning</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input defaultChecked className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">restaurant</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Meals Included</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input className="form-checkbox text-primary focus:ring-primary h-5 w-5 border-outline rounded" type="checkbox" />
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">local_laundry_service</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Laundry</span>
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

            <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-body-lg text-body-lg font-semibold hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Right Content Area: Listings */}
        <div className="flex-grow flex flex-col">
          {/* Mobile Filter Toggle & Sorting Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-stack-md gap-4">
            <div>
              <h1 className="font-h1 text-h1 text-on-surface">Available PGs in Kothri</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Showing 24 properties matching your criteria</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button className="md:hidden flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-outline rounded-lg bg-surface text-on-surface-variant font-body-md text-body-md cursor-pointer">
                <span className="material-symbols-outlined">tune</span>
                Filters
              </button>
              <div className="relative flex-1 sm:flex-none">
                <select className="w-full appearance-none bg-surface border border-outline text-on-surface-variant py-2 pl-4 pr-10 rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                  <option>Sort by: Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Closest to Campus</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>
          </div>

          {/* Bento Grid / Asymmetric Grid for Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-stack-md">
            {/* Card 1 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(76,29,149,0.05)] hover:shadow-[0px_8px_30px_rgba(76,29,149,0.15)] transition-shadow duration-300 border border-outline-variant/20 flex flex-col relative cursor-pointer">
              <div className="absolute top-4 right-4 z-10 bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-md">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
              </div>
              <div className="h-56 w-full relative overflow-hidden">
                <img alt="Modern student bedroom" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4439eyKIteT_JPudz1y3Wn86y_KUM_uHfQRTACJuO1WSjfdzGSnxZUEGsA3J6qicNibZ0yMdTdzf-ERmtX-eUQpoW_i-9ktzlbULGOC_z3BV28ZUI00IQvzVE5ZuZl2H2GnPZG_KiRHZMF6_o-sOei5Q_IMa5dSI1HPG8uOWdOg7DxeQq3E4p5FFm4_411hHiTYCy8U1z0wudbXwn_kAZ0T-KL2ixqUmvhMhqoVEPe6F_XfH4ah-RnCdgLy2WFyQC6Zvxm5yEXM-c" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-h2 text-h2 text-on-surface group-hover:text-primary transition-colors">Sunrise Premium Boys Hostel</h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mb-stack-sm">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  Near Main Gate, Kothri • 1.2 km from VIT
                </p>
                <div className="flex flex-wrap gap-2 mb-stack-md">
                  <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                    <span className="material-symbols-outlined text-[16px]">wifi</span> High-Speed WiFi
                  </div>
                  <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                    <span className="material-symbols-outlined text-[16px]">restaurant</span> 3 Meals/Day
                  </div>
                  <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                    <span className="material-symbols-outlined text-[16px]">ac_unit</span> AC Rooms
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-end">
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Starting from</p>
                    <p className="font-h2 text-h2 text-primary font-bold">₹7,500<span className="font-body-md text-body-md font-normal text-on-surface-variant">/mo</span></p>
                  </div>
                  <button className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-body-md text-body-md font-semibold hover:bg-on-secondary-fixed-variant transition-colors shadow-sm cursor-pointer">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(76,29,149,0.05)] hover:shadow-[0px_8px_30px_rgba(76,29,149,0.15)] transition-shadow duration-300 border border-outline-variant/20 flex flex-col relative cursor-pointer">
              <div className="absolute top-4 left-4 z-10 bg-error/90 text-on-error px-3 py-1 rounded-full font-label-sm text-label-sm shadow-md">
                Filling Fast
              </div>
              <div className="h-56 w-full relative overflow-hidden">
                <img alt="Cozy shared living space for students" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyy8VLRzVey67ryRRNXsVKfieMYQtUqfTzjc-dp8ZyE2aj-ISj8biKOeLHNbYfnSCk1JZ_ydxDrCE97-qR_1cfvwBhWX02rf4Lt2HbmP9ikgj9CyxAS4w9JvbIrNdKOCvy6ejLJM6Ki29FJThw9qBAJ4LjYupUlyjCgl_ay1hNzM7wQ8oRJ9cDVGEP-7SFQL3LCo4HenUOsLh46ZDjRQC95OO9OMyVhUp4KxqKR9a0Q_JoyWzW4DoTMkGBgeUMOJDl_jhuUoHitwHS" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-h2 text-h2 text-on-surface group-hover:text-primary transition-colors">Greenwood Girls Enclave</h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mb-stack-sm">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  Market Area, Kothri • 2.5 km from VIT
                </p>
                <div className="flex flex-wrap gap-2 mb-stack-md">
                  <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                    <span className="material-symbols-outlined text-[16px]">wifi</span> Basic WiFi
                  </div>
                  <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                    <span className="material-symbols-outlined text-[16px]">local_laundry_service</span> Laundry
                  </div>
                  <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                    <span className="material-symbols-outlined text-[16px]">directions_bus</span> Shuttle to Campus
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-end">
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Starting from</p>
                    <p className="font-h2 text-h2 text-primary font-bold">₹6,000<span className="font-body-md text-body-md font-normal text-on-surface-variant">/mo</span></p>
                  </div>
                  <button className="bg-surface text-primary border border-primary px-6 py-2.5 rounded-lg font-body-md text-body-md font-semibold hover:bg-primary/5 transition-colors cursor-pointer">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(76,29,149,0.05)] hover:shadow-[0px_8px_30px_rgba(76,29,149,0.15)] transition-shadow duration-300 border border-outline-variant/20 flex flex-col relative lg:col-span-2 cursor-pointer">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-md">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                  </div>
                  <img alt="Spacious modern student room" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAZSDfXtpR0qfXkXu6uWXgFbb4rTlEuU_tVsCBVjvfOLiQiao1RJz8zNXHC1VJMqW-iYpQ-EKnnXtRlvTltQz1tSyqgegBOp3wy4Z1yKIpkCeEPYvKilj7K9ms-rI7uJj4lK_KcRnLjA5rVEwkqyc_AlrwNtI0IJ3hT_elLj2q4CSmUdLUOrrYntyg2ohnV6XvxLuac6uokU_ddtjLCd7-AWtCcsmS0Seq5uXbpeAZn_0Jl32xx8v7AnvTtZx58TxVsC2-hVwvebpk" />
                </div>
                <div className="p-6 flex flex-col flex-grow md:w-3/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-h2 text-h2 text-on-surface group-hover:text-primary transition-colors">Elite Co-living Spaces</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        Premium Sector, Kothri • 0.8 km from VIT
                      </p>
                    </div>
                    <div className="bg-surface-container-high text-primary px-2 py-1 rounded font-label-sm text-label-sm">
                      Co-ed
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-stack-md mt-2">
                    Experience premium student living with state-of-the-art facilities, dedicated study zones, and high-speed internet designed for modern academic needs.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-stack-md">
                    <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                      <span className="material-symbols-outlined text-[16px]">wifi</span> Fiber Internet
                    </div>
                    <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                      <span className="material-symbols-outlined text-[16px]">restaurant</span> Premium Meals
                    </div>
                    <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/10">
                      <span className="material-symbols-outlined text-[16px]">ac_unit</span> Central AC
                    </div>
                    <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm items-center gap-1.5 border border-primary/10 hidden md:flex">
                      <span className="material-symbols-outlined text-[16px]">fitness_center</span> Gym Access
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-end">
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Starting from</p>
                      <p className="font-h2 text-h2 text-primary font-bold">₹11,000<span className="font-body-md text-body-md font-normal text-on-surface-variant">/mo</span></p>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-surface text-primary border border-primary px-4 py-2.5 rounded-lg font-body-md text-body-md font-semibold hover:bg-primary/5 transition-colors hidden sm:block cursor-pointer">
                        View Map
                      </button>
                      <button className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-body-md text-body-md font-semibold hover:bg-on-secondary-fixed-variant transition-colors shadow-sm cursor-pointer">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Load More */}
          <div className="mt-stack-lg flex justify-center">
            <button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-body-lg text-body-lg font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-sm hover:shadow-md cursor-pointer">
              Load More Properties
            </button>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(76,29,149,0.05)] rounded-t-xl md:hidden">
        <Link className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container dark:bg-primary-fixed-dim dark:text-on-primary-fixed rounded-full px-5 py-1 scale-90 transition-all duration-200" href="/pgs">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-sm text-label-sm mt-1">Search</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim" href="#">
          <span className="material-symbols-outlined">favorite</span>
          <span className="font-label-sm text-label-sm mt-1">Saved</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim" href="#">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-label-sm text-label-sm mt-1">Bookings</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-label-sm mt-1">Profile</span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="w-full mt-stack-lg bg-surface-container-highest dark:bg-on-background border-t border-outline-variant dark:border-outline py-stack-lg px-margin-mobile md:px-gutter pb-24 md:pb-stack-lg">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-stack-md">
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="font-display text-h1 text-primary dark:text-primary-fixed-dim">
              PG Genie
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your digital concierge for finding the perfect student accommodation in Kothri. Simple, secure, and magical.
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-4">
              © 2026 PG Genie. Dedicated to VIT Bhopal Community.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-h2 text-h2 text-on-surface mb-2">Quick Links</h4>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">About Kothri</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Owner Dashboard</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Help Center</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Privacy Policy</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
