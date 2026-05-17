"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function OwnerDashboardPage() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-full w-72 left-0 top-0 fixed z-50 bg-surface dark:bg-on-background shadow-xl p-gutter">
        <span className="font-display text-h2 text-primary mb-6 block cursor-default">PG Genie</span>
        <div className="flex items-center gap-4 mb-stack-lg">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-primary-container/20">
            <img 
              alt="Owner profile avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa6i3t63X_3Eaz-W-RdWzSWo5T-A9zZsL9lg81Swah_4fYUoTXodRfa2wbp2ZYgJN0ANnVSJn8Lw-FW4fijKfST2BjcLO6jJKnZOANjWWHX5LAHVQdtGCS--HVrjFf5XHLaYEhcSOo5axpH8huhk-jWu7_QJ-k9w3Y4scPvwfnyCytn00yA48mudilOsUorI1uw8yzK05Hepgi_ID6iMlsqv1gpLSshTrzJfc4mZCxg9mOHudlWHg0JsTzWsZ2xPKxJmhfFSeCuO3o"
            />
          </div>
          <div>
            <h2 className="font-h2 text-h2 text-on-surface">Owner Portal</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Verified Kothri Owner</p>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-semibold shadow-sm" href="/owner/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-body-md text-body-md">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container transition-all hover:scale-[1.02] hover:shadow-sm" href="/">
            <span className="material-symbols-outlined">public</span>
            <span className="font-body-md text-body-md">Home Page</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container transition-all hover:scale-[1.02] hover:shadow-sm" href="#">
            <span className="material-symbols-outlined">list_alt</span>
            <span className="font-body-md text-body-md">My Listings</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container transition-all hover:scale-[1.02] hover:shadow-sm" href="#">
            <span className="material-symbols-outlined">payments</span>
            <span className="font-body-md text-body-md">Payment History</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container transition-all hover:scale-[1.02] hover:shadow-sm" href="#">
            <span className="material-symbols-outlined">help_outline</span>
            <span className="font-body-md text-body-md">Support</span>
          </Link>
        </nav>
        
        <div className="mt-auto">
          <button className="w-full bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-on-secondary font-h2 text-body-lg font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-105 cursor-pointer">
            <span className="material-symbols-outlined">add_circle</span>
            List your PG
          </button>
        </div>
      </aside>
      
      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* TopNavBar */}
        <Navbar className="sticky top-0 z-40 bg-surface shadow-sm text-primary" />
        
        <div className="flex-1 p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full space-y-stack-lg">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-sm pt-4">
            <div>
              <h1 className="font-display text-display text-on-surface mb-2">Welcome back, Sharma Ji</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Here is what&apos;s happening with your properties in Kothri today.</p>
            </div>
            <button className="bg-primary hover:bg-primary-container text-on-primary px-6 py-3 rounded-xl font-h2 text-body-md flex items-center gap-2 shadow-lg transition-all active:scale-95 hover:scale-105 hover:shadow-xl cursor-pointer">
              <span className="material-symbols-outlined">add_home</span>
              Add New Listing
            </button>
          </div>
          
          {/* Stats Overview (Bento Grid) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
            <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container-high relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all hover:scale-[1.02]">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-fixed rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-surface rounded-lg text-primary"><span className="material-symbols-outlined fill text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>apartment</span></div>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">+1 this month</span>
              </div>
              <h3 className="font-body-md text-body-md text-on-surface-variant mb-1 relative z-10">Total Listings</h3>
              <p className="font-display text-h1 text-on-surface relative z-10">4</p>
            </div>
            
            <div className="bg-primary-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all text-on-primary-container hover:scale-[1.02]">
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-primary opacity-10 rounded-tl-full group-hover:scale-125 transition-transform duration-500"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-surface/20 rounded-lg text-on-primary-container"><span className="material-symbols-outlined fill text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span></div>
                <span className="bg-surface/20 px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span> 3 Unread</span>
              </div>
              <h3 className="font-body-md text-body-md text-on-primary-container/80 mb-1 relative z-10">Active Leads</h3>
              <p className="font-display text-h1 relative z-10">12</p>
            </div>
            
            <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container-high relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all hover:scale-[1.02]">
              <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-secondary-fixed rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-surface rounded-lg text-secondary"><span className="material-symbols-outlined fill text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span></div>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> 24%</span>
              </div>
              <h3 className="font-body-md text-body-md text-on-surface-variant mb-1 relative z-10">Views this Month</h3>
              <p className="font-display text-h1 text-on-surface relative z-10">845</p>
            </div>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
            {/* Your Listings */}
            <section className="lg:col-span-2 space-y-stack-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-h2 text-h2 text-on-surface">Your Listings</h2>
                <button className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer">View All</button>
              </div>
              
              <div className="space-y-4">
                {/* Listing Card 1 */}
                <div className="rounded-xl p-4 shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-outline-variant/30 flex flex-col sm:flex-row gap-4 hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all bg-surface-container-low hover:scale-[1.01] hover:shadow-xl">
                  <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 relative">
                    <img 
                      alt="PG Room Interior" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzSJDZocQb0gKZVkHa20kfARAWN6ECs4m3RoxBT9Rx0FSXwIYD4WPtPL4yVC3KYXHdZw77dWUkWnFRbVvlkjyGtdpuvKIsoWuuAi-NbOjCKNzxgSiMOu1LFSBhl-FD2jtxPn9V9ngzROO23Ps9vasT__5f3qT3Ht4lO5lU5UNwQ1H0C3jhZGdRppAhwtKMe7M-TMVzZKRR4efJId_dcPCAqIDzUB7yW4puIhMXvMSHlet8vUfscdFf40KQKKUBgZTtjGvhGRvMDqya"
                    />
                    <div className="absolute top-2 left-2 bg-secondary text-on-secondary px-2 py-1 rounded-md font-label-sm text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span> Available
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-h2 text-body-lg text-on-surface">Sunrise Boys Hostel</h3>
                        <span className="font-h2 text-body-lg text-primary">₹6,500<span className="text-body-md text-on-surface-variant font-normal">/mo</span></span>
                      </div>
                      <p className="font-body-md text-label-sm text-on-surface-variant flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-[16px]">location_on</span> Near VIT Bhopal, Kothri
                      </p>
                      <div className="flex gap-2 mb-3">
                        <span className="bg-primary/5 text-primary px-2 py-1 rounded font-label-sm text-[10px] flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">wifi</span> WiFi</span>
                        <span className="bg-primary/5 text-primary px-2 py-1 rounded font-label-sm text-[10px] flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">ac_unit</span> AC</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 border-[1.5px] border-primary text-primary hover:bg-primary-container/10 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-colors text-center hover:scale-105 hover:shadow-xl cursor-pointer">Edit</button>
                      <button className="flex-1 border-[1.5px] border-outline-variant text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-lg font-label-sm text-label-sm transition-colors text-center hover:scale-105 hover:shadow-xl cursor-pointer">Mark as Filled</button>
                    </div>
                  </div>
                </div>
                
                {/* Listing Card 2 */}
                <div className="rounded-xl p-4 shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-outline-variant/30 flex flex-col sm:flex-row gap-4 hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all bg-surface-container-low hover:scale-[1.01] hover:shadow-xl">
                  <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 relative">
                    <img 
                      alt="PG Room Interior" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOeQFEooVMV8xujdFXABWPVqGkKhAcXOQILSUTQIYMAiTF7iVMcsFiuwWEvfXMeqqkqYfN6b61ZhBPMLaLCpMzvZAifhUn9OuA-p9ARK1UUATKX-bGSWsPqDu7OLOhqvUm5l_CzUt26UW3l9-0z-7GU57SF61x7hmJQ913cxlK7EAPsRpaIwS2SL4x0jspuO6IGjV46jd8ZH9PYIyZnbtLcfKXUUIHtOWyL7mE0DlVkHZ4NunJ99MjQSuVF2HSgdOvOeFdnBFQTp93"
                    />
                    <div className="absolute top-2 left-2 bg-error-container text-on-error-container px-2 py-1 rounded-md font-label-sm text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Filling Fast
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-h2 text-body-lg text-on-surface">Elite Girls Premium PG</h3>
                        <span className="font-h2 text-body-lg text-primary">₹8,000<span className="text-body-md text-on-surface-variant font-normal">/mo</span></span>
                      </div>
                      <p className="font-body-md text-label-sm text-on-surface-variant flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-[16px]">location_on</span> Main Market, Kothri
                      </p>
                      <div className="flex gap-2 mb-3">
                        <span className="bg-primary/5 text-primary px-2 py-1 rounded font-label-sm text-[10px] flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">local_laundry_service</span> Laundry</span>
                        <span className="bg-primary/5 text-primary px-2 py-1 rounded font-label-sm text-[10px] flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">restaurant</span> Meals</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 border-[1.5px] border-primary text-primary hover:bg-primary-container/10 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-colors text-center hover:scale-105 hover:shadow-xl cursor-pointer">Edit</button>
                      <button className="flex-1 border-[1.5px] border-outline-variant text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-lg font-label-sm text-label-sm transition-colors text-center hover:scale-105 hover:shadow-xl cursor-pointer">Mark as Filled</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* New Inquiries */}
            <section className="lg:col-span-1 space-y-stack-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-h2 text-h2 text-on-surface">New Inquiries</h2>
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-label-sm text-[10px]">3 New</span>
              </div>
              
              <div className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/20">
                {/* Inquiry 1 */}
                <div className="p-4 hover:bg-surface-container-low transition-colors hover:scale-[1.02] hover:shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-h2 text-body-md shrink-0">
                      AK
                    </div>
                    <div>
                      <h4 className="font-h2 text-body-md text-on-surface">Aman Kumar</h4>
                      <p className="font-body-md text-label-sm text-on-surface-variant">Interested in: Sunrise Boys Hostel</p>
                      <p className="font-label-sm text-[10px] text-outline mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-secondary/10 text-secondary hover:bg-secondary hover:text-on-secondary px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center gap-1 hover:scale-105 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">call</span> Call
                    </button>
                    <button className="flex-1 bg-primary-container/10 text-primary-container hover:bg-primary-container hover:text-on-primary-container px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center gap-1 hover:scale-105 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">chat</span> Message
                    </button>
                  </div>
                </div>
                
                {/* Inquiry 2 */}
                <div className="p-4 hover:bg-surface-container-low transition-colors hover:scale-[1.02] hover:shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-h2 text-body-md shrink-0">
                      PS
                    </div>
                    <div>
                      <h4 className="font-h2 text-body-md text-on-surface">Priya Singh</h4>
                      <p className="font-body-md text-label-sm text-on-surface-variant">Interested in: Elite Girls Premium PG</p>
                      <p className="font-label-sm text-[10px] text-outline mt-1">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-secondary/10 text-secondary hover:bg-secondary hover:text-on-secondary px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center gap-1 hover:scale-105 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">call</span> Call
                    </button>
                    <button className="flex-1 bg-primary-container/10 text-primary-container hover:bg-primary-container hover:text-on-primary-container px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center gap-1 hover:scale-105 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">chat</span> Message
                    </button>
                  </div>
                </div>
                
                {/* Inquiry 3 */}
                <div className="p-4 hover:bg-surface-container-low transition-colors hover:scale-[1.02] hover:shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-h2 text-body-md shrink-0">
                      RJ
                    </div>
                    <div>
                      <h4 className="font-h2 text-body-md text-on-surface">Rahul Jain</h4>
                      <p className="font-body-md text-label-sm text-on-surface-variant">Interested in: Sunrise Boys Hostel</p>
                      <p className="font-label-sm text-[10px] text-outline mt-1">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-secondary/10 text-secondary hover:bg-secondary hover:text-on-secondary px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center gap-1 hover:scale-105 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">call</span> Call
                    </button>
                    <button className="flex-1 bg-primary-container/10 text-primary-container hover:bg-primary-container hover:text-on-primary-container px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center gap-1 hover:scale-105 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">chat</span> Message
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="w-full mt-auto bg-surface-container-highest dark:bg-on-background border-t border-outline-variant dark:border-outline">
          <div className="py-stack-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-stack-md">
            <div>
              <div className="font-display text-h1 text-primary dark:text-primary-fixed-dim mb-4">PG Genie</div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">© 2026 PG Genie. Dedicated to VIT Bhopal Community.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">About Kothri</Link>
              <Link className="font-body-md text-body-md text-primary dark:text-primary-fixed-dim underline opacity-70" href="/owner/dashboard">Owner Dashboard</Link>
              <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Help Center</Link>
              <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Privacy Policy</Link>
              <Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Contact Support</Link>
            </div>
          </div>
        </footer>
      </main>
      
      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(76,29,149,0.05)] shadow-lg left-0 flex justify-around items-center px-4 py-3 pb-safe">
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim" href="/pgs">
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
        <Link className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container dark:bg-primary-fixed-dim dark:text-on-primary-fixed rounded-full px-5 py-1 scale-90 transition-all duration-200" href="/owner/dashboard">
          <span className="material-symbols-outlined fill" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="font-label-sm text-label-sm mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
