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
            <Link href="/dashboard/profile" className="hover:bg-primary-container/10 transition-colors p-2 rounded-full cursor-pointer flex items-center justify-center">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </div>
      </nav>

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
                    <img alt="PG Room Interior" className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_2ZKtJydO2X9yH875coYl82RujkBEKFMRYHQetVk2kSmg4YPZKn-fwh_nhHwbELfCF8aMy837usO2nGlBs6ccUtFBQDlSIdvkX7AC72VUu43PoIpldI55x7NAgOagg2d79D0J17GHsqy9Ir5wfE4q-yNAvbAXPfx3VRrHBeDkMAbNfgbw61PPexem2CDozq6Ve8uGO-pWmCwDfthgc54cuLUluB-vhYdmPNkJW0St6RIYbLMSYjn_V4Ku9HQlEIdB-ozWahfB_5W1" />
                    <div className="absolute top-3 right-3 bg-secondary text-on-secondary font-label-sm text-label-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm cursor-default">
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
                    <img alt="PG Room Interior" className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYSImn85Ir3URWTcPTkHgj3UU1Ks0tG1DJgL3vmsiDmUzqNbesmY1B28bCuwp75gpJas4WlKeSeGX0ev0kGQjL1sSBqbzrodE6D4TgK58cPiM1KavuEEdnVy7SNix6xVRMOQ3QS65ExfzO5idyCSnwda7rnrOoC-VehE_ZuR8iohzg7JDmq_vgfK603Fm1rB2hPTSWAkqYq86HdiRJhTseexyM6YkHVFy8WXXxkLnhNBQrgc_g47_cKCDsqXCztl6GAc3fo2pmLKIk" />
                    <div className="absolute top-3 right-3 bg-tertiary text-on-tertiary font-label-sm text-label-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm cursor-default">
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
