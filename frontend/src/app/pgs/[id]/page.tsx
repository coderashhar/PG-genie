import React from 'react';
import Link from 'next/link';

export default function PgDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="w-full sticky top-0 z-40 shadow-sm bg-surface">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
          <span className="font-display text-h2 font-extrabold text-primary cursor-default">PG Genie</span>
          <div className="hidden md:flex flex-1 justify-center max-w-md px-gutter">
            <div className="w-full relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
              <input className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface transition-all outline-none" placeholder="Search Kothri PGs..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="notifications" className="p-2 rounded-full hover:bg-primary-container/10 transition-colors text-on-surface-variant flex items-center justify-center group cursor-pointer">
              <span className="material-symbols-outlined group-active:opacity-80 group-active:scale-95 transition-transform">notifications</span>
            </button>
            <Link href="/dashboard/profile" aria-label="account_circle" className="p-2 rounded-full hover:bg-primary-container/10 transition-colors text-on-surface-variant flex items-center justify-center group cursor-pointer">
              <span className="material-symbols-outlined group-active:opacity-80 group-active:scale-95 transition-transform">account_circle</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-md">
        {/* Breadcrumb & Back */}
        <div className="mb-stack-sm flex items-center gap-2">
          <Link className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm flex items-center gap-1 transition-colors" href="/pgs">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Search
          </Link>
        </div>

        {/* Bento Grid Gallery */}
        <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-base h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-stack-lg">
          <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden">
            <img alt="Main PG Bedroom" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNJt2uzAb2e9tBxRFwgvHZtFejTRJSiUAuFtn2VSUqeuqKZCGBj1V422BnPdLudz2Lwpn27XxNFiL9fZNBdtPNYU4JG4q-Dv3sigY-BcxI20-Lqal4-4Goxb8DtWTZsl5887GzPMm5ykrtrllpM8hjWnJFXThH28IeqaO0g7jsRJ5JzT-5Nqq1bFfQxEkSJ9urpAORzXCHqogikT9i-RCiqV7LNuEZJaQhw8nNc-RLdtv8VJcMomhaDE-q10WkYF-k5T-ivfFlLTmV" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <img alt="PG Study Area" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl1lswi8ICMhIHXxmXnRn0sUG_Tqg_l_xPyXKrBDKBj3-fPmW4hc8EgR1qIFzvILmWXXjpkBrCloexbogKv0aMF18w1hUoUE0Db-Nh4nSXToFIqH22r8oR9gOGDCrEuZVDNaN_2NrCfN3B3ovxtekrJ5LyxQmuJYj_0LyrUehgLZ_KZJZc0ks_RiToWW_xiJYKnutBkJvovTA0uIJEnO_udkguXEs1Rv8GwrORMwGLw9FSV0cLoXEChC3aP2s5buMQiZC8Y4kq2w_b" />
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <img alt="PG Dining Area" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAOunk0Y-Egi9aBLTxES0XJEAaeuSTkmO4pP02sDj8vuGbf7T11vOoA7qdP1sQHic0iK6QCaGVPMgLMg0llJaRNLb-aNs_U5-TGKWjvrOY0DSyi0VgJLctdaUvavNetNuN6dlqJe7aqiilf64HwebqGH6dBp0qpLyzl10EzU6cXG7dsabhQ7C6GATYh3d7xrSb2uAXi_sy1yUB65AdYuJhT1aiE1wSgsYWYO1TZtIohEHsFy-ocCnD_CRLV12uxpxgM4aWgyT_WBMN" />
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <img alt="PG Bathroom" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYKs9n1WctuPFe1w3au1cUX33G2gv2CrITYP-kxOApiFfQmgDGvlXFJ2zJE86LC0XeSIX9uFpSYNf2V4ZlQZHZc6YEdPHRMpkbZ6rbfHv3NsJC_mLmmTuLkBJ1Hme26Mo_pOLIC14I7I8fWxN5SzBDh2Anl0l7Y9lACVsNHpA8TFyvziAIthHkVD2laWnh0KveTCydI_yLmAMyyLv01qYaoBeJPKZ4xteguOGWGoQBv6cUjF5vwiSRFXlism-T1Gn81SpsiLaID0nq" />
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <img alt="PG Exterior" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_KBotTORFoshxZV5vwMG6m5f1YwgPGb5jNuSEazmEN2oAE7sCOagzWaYFzZ9xXHvwu8ljMN6yvClo5pW1ILEgPk44Q_10RiA8I0focJpdDqpZgLvegu8TnrNMP7v7P8PObkmQkUtGgM387ydS9-hMh-OMmwpdByLvZxivsEN79vn2JjqJk2aurYcQbf8gLWFV2UwPRsInWahmTTDtfqMpG4IPEq4_4mjaHSAvO84WgFVHeLfk_9w_V7UMLsfgwKVv08fN_MlC5azc" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/50">
              <span className="text-on-primary font-h2 text-h2 flex items-center gap-2">
                <span className="material-symbols-outlined">photo_library</span> +8 Photos
              </span>
            </div>
          </div>
        </section>

        {/* Main Layout: Content + Sticky Sidebar */}
        <div className="flex flex-col lg:flex-row gap-gutter relative">
          {/* Left Column: Details */}
          <div className="flex-1 flex flex-col gap-stack-lg">
            {/* Header Info */}
            <div>
              <div className="flex flex-wrap justify-between items-start gap-stack-sm mb-stack-sm">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Verified Partner
                    </span>
                    <span className="bg-surface-container-high text-on-surface px-2 py-1 rounded font-label-sm text-label-sm">Boys PG</span>
                  </div>
                  <h1 className="font-h1 text-h1 text-on-surface">Kothri Comforts</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[18px]">location_on</span> Near VIT Bhopal Main Gate, Kothri (1.2 km away)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-h1 text-primary">₹6,500<span className="font-body-sm text-body-sm text-on-surface-variant font-normal">/mo</span></p>
                  <p className="font-label-sm text-label-sm text-secondary flex items-center justify-end gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px] fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span> Filling Fast
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-outline-variant" />

            {/* Facilities */}
            <div>
              <h2 className="font-h2 text-h2 text-on-surface mb-stack-sm">Premium Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all text-center gap-2">
                  <span className="material-symbols-outlined text-[32px] text-primary">wifi</span>
                  <span className="font-label-sm text-label-sm text-on-surface">High-Speed WiFi</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all text-center gap-2">
                  <span className="material-symbols-outlined text-[32px] text-primary">battery_charging_full</span>
                  <span className="font-label-sm text-label-sm text-on-surface">24/7 Power Backup</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all text-center gap-2">
                  <span className="material-symbols-outlined text-[32px] text-primary">restaurant</span>
                  <span className="font-label-sm text-label-sm text-on-surface">3 Meals / Day</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all text-center gap-2">
                  <span className="material-symbols-outlined text-[32px] text-primary">local_laundry_service</span>
                  <span className="font-label-sm text-label-sm text-on-surface">Laundry Service</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all text-center gap-2">
                  <span className="material-symbols-outlined text-[32px] text-primary">security</span>
                  <span className="font-label-sm text-label-sm text-on-surface">CCTV Security</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all text-center gap-2">
                  <span className="material-symbols-outlined text-[32px] text-primary">cleaning_services</span>
                  <span className="font-label-sm text-label-sm text-on-surface">Daily Cleaning</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all text-center gap-2">
                  <span className="material-symbols-outlined text-[32px] text-primary">ac_unit</span>
                  <span className="font-label-sm text-label-sm text-on-surface">AC Rooms Available</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all text-center gap-2">
                  <span className="material-symbols-outlined text-[32px] text-primary">directions_bus</span>
                  <span className="font-label-sm text-label-sm text-on-surface">Transport to VIT</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-outline-variant" />

            {/* Description */}
            <div>
              <h2 className="font-h2 text-h2 text-on-surface mb-stack-sm">About the Property</h2>
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <p className="font-body-md text-body-md text-on-surface-variant mb-4 leading-relaxed">
                  Kothri Comforts is a premium, newly constructed boys&apos; accommodation located just a 5-minute drive from the VIT Bhopal main gate. We prioritize student comfort and safety, providing a quiet environment ideal for studying. Our rooms are spacious, well-ventilated, and come fully furnished with modern study tables and ergonomic chairs.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                  The owner, Mr. Sharma, lives on the ground floor and is available 24/7 for any emergencies. We serve hygienic, home-style meals tailored for students, with special menus during exam times.
                </p>
                <Link href={`/owners/sharma`} className="flex items-center gap-4 bg-surface-container-low p-4 rounded-lg hover:bg-surface-container transition-colors group cursor-pointer w-full sm:w-fit pr-10">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-h2 text-h2 group-hover:scale-105 transition-transform">
                    S
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface mb-1">Managed by</p>
                    <p className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">Mr. R.K. Sharma <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span></p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-outline-variant" />

            {/* Map Section */}
            <div className="mb-stack-lg">
              <h2 className="font-h2 text-h2 text-on-surface mb-stack-sm">Location</h2>
              <div className="rounded-xl overflow-hidden border border-outline-variant shadow-sm h-[300px] relative bg-surface-container">
                {/* Placeholder for Map */}
                <img alt="Map View" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3-V-dHDql6dbwaImnrlFEDWrOLiKA6fGAkS4w0FHvVVbeo4p25IHlpKFZtPu-HOQ6_Bw9W_wjAsyN_Ies31zmhXky5q9uGyTP-jQStT_hqPHps5g51yNWd6PDG2HxfoaN9IUEp4c4gnOtMti2E_xG3hQ0od7JUI4Hf3azcKc-Hei-2JI9dfT9NdD6BSbxi9XWuZRPKB1fhomhAbKr9UBmgxvK4jsX3o7SMw3IpgvyckBheGhgRm3y9DhKZqMqvLSsScTgGkInHVzv" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-surface/90 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center pointer-events-auto border border-outline-variant">
                    <span className="material-symbols-outlined text-[32px] text-primary mb-2">map</span>
                    <p className="font-label-sm text-label-sm text-on-surface">Interactive Map Area</p>
                    <button className="mt-2 text-primary font-label-sm text-label-sm hover:underline cursor-pointer">View on Google Maps</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action Sidebar */}
          <div className="w-full lg:w-[350px]">
            <div className="sticky top-[88px] bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <p className="font-body-md text-body-md text-on-surface-variant mb-1">Starting from</p>
                <div className="flex items-end gap-2">
                  <span className="font-display text-h1 text-primary">₹6,500</span>
                  <span className="font-body-md text-body-md text-on-surface-variant mb-1">/ month</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary font-label-sm text-label-sm py-4 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  Book a Visit
                </button>
                <button className="w-full bg-surface-container-lowest border-2 border-primary text-primary hover:bg-primary/5 font-label-sm text-label-sm py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  Contact Owner
                </button>
              </div>
              <div className="mt-6 bg-surface-container-low p-4 rounded-lg">
                <h3 className="font-label-sm text-label-sm text-on-surface mb-2">Available Room Types</h3>
                <ul className="flex flex-col gap-2">
                  <li className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                    <span>Double Sharing</span>
                    <span className="font-semibold text-on-surface">₹6,500</span>
                  </li>
                  <li className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                    <span>Single Room</span>
                    <span className="font-semibold text-on-surface">₹9,000</span>
                  </li>
                </ul>
              </div>
              <p className="mt-4 font-label-sm text-label-sm text-center text-outline flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">info</span> No brokerage fees via PG Genie
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-stack-lg bg-surface-container-highest border-t border-outline-variant">
        <div className="w-full py-stack-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-stack-md">
          <div>
            <Link className="font-display text-h1 text-primary" href="/">PG Genie</Link>
            <p className="mt-2 text-on-surface-variant font-body-md text-body-md">© 2026 PG Genie. Dedicated to VIT Bhopal Community.</p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8">
            <Link className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">About Kothri</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="/owner/dashboard">Owner Dashboard</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">Help Center</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">Privacy Policy</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
