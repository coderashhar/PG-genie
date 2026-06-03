"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// --- Types ---
interface PropertyLocation {
  address: string;
  city: string;
  state: string;
}

interface ListingData {
  _id: string;
  title: string;
  description: string;
  location: PropertyLocation;
  price: number;
  images: string[];
  status: string;
  amenities: string[];
  views: number;
  monthlyViews: { month: number; year: number; count: number }[];
  createdAt: string;
}

interface InquiryStudent {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
}

interface InquiryPg {
  _id: string;
  title: string;
}

interface InquiryData {
  _id: string;
  studentId: InquiryStudent;
  pgId: InquiryPg;
  status: string;
  message?: string;
  createdAt: string;
}

interface OwnerDashboardData {
  owner: {
    id: string;
    name: string;
    email: string;
    image?: string;
    businessName?: string;
  };
  listings: ListingData[];
  inquiries: InquiryData[];
  stats: {
    totalListings: number;
    activeLeads: number;
    unreadInquiries: number;
    viewsThisMonth: number;
    viewsChangePercent: number;
    newListingsThisMonth: number;
  };
}

// --- Amenity icon map ---
const amenityIconMap: Record<string, string> = {
  WiFi: 'wifi',
  'High-Speed WiFi': 'wifi',
  'Fiber Internet': 'wifi',
  AC: 'ac_unit',
  'Central AC': 'ac_unit',
  Laundry: 'local_laundry_service',
  Meals: 'restaurant',
  'Premium Meals': 'restaurant',
  Gym: 'fitness_center',
  'Study Room': 'menu_book',
  'Study Zone': 'menu_book',
};

// --- Helper ---
function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// --- Skeletons ---
function StatSkeleton() {
  return (
    <div className="bg-surface-container rounded-xl p-gutter animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-12 w-12 bg-surface rounded-lg" />
        <div className="h-6 w-20 bg-surface rounded-full" />
      </div>
      <div className="h-4 w-24 bg-surface rounded mb-2" />
      <div className="h-8 w-12 bg-surface rounded" />
    </div>
  );
}

function ListingCardSkeleton() {
  return (
    <div className="rounded-xl p-4 border border-outline-variant/30 flex flex-col sm:flex-row gap-4 bg-surface-container-low animate-pulse">
      <div className="w-full sm:w-48 h-32 rounded-lg bg-surface-container" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-48 bg-surface-container rounded" />
        <div className="h-4 w-32 bg-surface-container rounded" />
        <div className="flex gap-2">
          <div className="h-6 w-14 bg-surface-container rounded" />
          <div className="h-6 w-14 bg-surface-container rounded" />
        </div>
      </div>
    </div>
  );
}

// --- Inquiry Card Colors ---
const inquiryColors = [
  { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  { bg: 'bg-primary-container', text: 'text-on-primary-container' },
];

export default function OwnerDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [dashData, setDashData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOwnerDashboard() {
      try {
        const res = await fetch('/api/owner/dashboard');
        if (!res.ok) {
          if (res.status === 401) {
            setError('Please log in to view your dashboard.');
            return;
          }
          if (res.status === 403) {
            setError('Only property owners can access this dashboard.');
            return;
          }
          throw new Error('Failed to fetch owner dashboard data');
        }
        const data = await res.json();
        setDashData(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    if (sessionStatus !== 'loading') {
      fetchOwnerDashboard();
    }
  }, [sessionStatus]);

  const ownerName = dashData?.owner?.name || session?.user?.name || 'Owner';
  const ownerImage = dashData?.owner?.image || session?.user?.image;
  const stats = dashData?.stats;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-full w-72 left-0 top-0 fixed z-50 bg-surface dark:bg-on-background shadow-xl p-gutter">
        <span className="font-display text-h2 text-primary mb-6 block cursor-default">PG Genie</span>
        <div className="flex items-center gap-4 mb-stack-lg">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-primary-container/20">
            {ownerImage ? (
              <img alt="Owner profile avatar" className="w-full h-full object-cover" src={ownerImage} />
            ) : (
              <div className="w-full h-full bg-primary-container flex items-center justify-center text-on-primary-container font-h2">
                {ownerName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-h2 text-h2 text-on-surface">Owner Portal</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {dashData?.owner?.businessName || 'Verified Owner'}
            </p>
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
        
        <div className="flex-1 p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full space-y-stack-lg">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-sm pt-4">
            <div>
              <h1 className="font-display text-display text-on-surface mb-2">
                {loading ? (
                  <span className="inline-block h-10 w-80 bg-surface-container rounded animate-pulse" />
                ) : (
                  `Welcome back, ${ownerName}`
                )}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Here is what&apos;s happening with your properties in Kothri today.</p>
            </div>
            <button className="bg-primary hover:bg-primary-container text-on-primary px-6 py-3 rounded-xl font-h2 text-body-md flex items-center gap-2 shadow-lg transition-all active:scale-95 hover:scale-105 hover:shadow-xl cursor-pointer">
              <span className="material-symbols-outlined">add_home</span>
              Add New Listing
            </button>
          </div>
          
          {/* Error State */}
          {error && (
            <div className="bg-error-container text-on-error-container p-6 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              <p>{error}</p>
            </div>
          )}

          {/* Stats Overview (Bento Grid) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
            {loading ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container-high relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all hover:scale-[1.02]">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-fixed rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-surface rounded-lg text-primary">
                      <span className="material-symbols-outlined fill text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>apartment</span>
                    </div>
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
                      +{stats?.newListingsThisMonth || 0} this month
                    </span>
                  </div>
                  <h3 className="font-body-md text-body-md text-on-surface-variant mb-1 relative z-10">Total Listings</h3>
                  <p className="font-display text-h1 text-on-surface relative z-10">{stats?.totalListings || 0}</p>
                </div>
                
                <div className="bg-primary-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all text-on-primary-container hover:scale-[1.02]">
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-primary opacity-10 rounded-tl-full group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-surface/20 rounded-lg text-on-primary-container">
                      <span className="material-symbols-outlined fill text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                    </div>
                    <span className="bg-surface/20 px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      {stats?.unreadInquiries || 0} Unread
                    </span>
                  </div>
                  <h3 className="font-body-md text-body-md text-on-primary-container/80 mb-1 relative z-10">Active Leads</h3>
                  <p className="font-display text-h1 relative z-10">{stats?.activeLeads || 0}</p>
                </div>
                
                <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container-high relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all hover:scale-[1.02]">
                  <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-secondary-fixed rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-surface rounded-lg text-secondary">
                      <span className="material-symbols-outlined fill text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                    </div>
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        {(stats?.viewsChangePercent || 0) >= 0 ? 'trending_up' : 'trending_down'}
                      </span>
                      {Math.abs(stats?.viewsChangePercent || 0)}%
                    </span>
                  </div>
                  <h3 className="font-body-md text-body-md text-on-surface-variant mb-1 relative z-10">Views this Month</h3>
                  <p className="font-display text-h1 text-on-surface relative z-10">
                    {stats?.viewsThisMonth?.toLocaleString('en-IN') || 0}
                  </p>
                </div>
              </>
            )}
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
            {/* Your Listings */}
            <section className="lg:col-span-2 space-y-stack-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-h2 text-h2 text-on-surface">Your Listings</h2>
                <button className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer">View All</button>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  <>
                    <ListingCardSkeleton />
                    <ListingCardSkeleton />
                  </>
                ) : dashData && dashData.listings.length > 0 ? (
                  dashData.listings.map((listing) => (
                    <div
                      key={listing._id}
                      className="rounded-xl p-4 shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-outline-variant/30 flex flex-col sm:flex-row gap-4 hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all bg-surface-container-low hover:scale-[1.01] hover:shadow-xl"
                    >
                      <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 relative">
                        <img
                          alt={listing.title}
                          className="w-full h-full object-cover"
                          src={listing.images?.[0] || '/placeholder.jpg'}
                        />
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-md font-label-sm text-[10px] flex items-center gap-1 ${
                          listing.status === 'active'
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-error-container text-on-error-container'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                          {listing.status === 'active' ? 'Available' : 'Inactive'}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-h2 text-body-lg text-on-surface">{listing.title}</h3>
                            <span className="font-h2 text-body-lg text-primary">
                              ₹{listing.price?.toLocaleString('en-IN')}
                              <span className="text-body-md text-on-surface-variant font-normal">/mo</span>
                            </span>
                          </div>
                          <p className="font-body-md text-label-sm text-on-surface-variant flex items-center gap-1 mb-2">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            {listing.location?.address || 'Kothri'}
                          </p>
                          <div className="flex gap-2 mb-3">
                            {listing.amenities?.slice(0, 2).map((amenity) => (
                              <span
                                key={amenity}
                                className="bg-primary/5 text-primary px-2 py-1 rounded font-label-sm text-[10px] flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  {amenityIconMap[amenity] || 'check_circle'}
                                </span>
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <button className="flex-1 border-[1.5px] border-primary text-primary hover:bg-primary-container/10 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-colors text-center hover:scale-105 hover:shadow-xl cursor-pointer">
                            Edit
                          </button>
                          <button className="flex-1 border-[1.5px] border-outline-variant text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-lg font-label-sm text-label-sm transition-colors text-center hover:scale-105 hover:shadow-xl cursor-pointer">
                            Mark as Filled
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl p-8 bg-surface-container text-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">add_home</span>
                    <p className="font-body-lg text-on-surface-variant">No listings yet. Add your first property!</p>
                  </div>
                )}
              </div>
            </section>
            
            {/* New Inquiries */}
            <section className="lg:col-span-1 space-y-stack-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-h2 text-h2 text-on-surface">New Inquiries</h2>
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-label-sm text-[10px]">
                  {loading ? '...' : `${stats?.activeLeads || 0} New`}
                </span>
              </div>
              
              <div className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/20">
                {loading ? (
                  <div className="p-4 space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-surface-container rounded" />
                        <div className="h-3 w-36 bg-surface-container rounded" />
                      </div>
                    </div>
                  </div>
                ) : dashData && dashData.inquiries.length > 0 ? (
                  dashData.inquiries.filter(i => i.status === 'pending').slice(0, 5).map((inquiry, index) => {
                    const color = inquiryColors[index % inquiryColors.length];
                    const student = inquiry.studentId;
                    const pg = inquiry.pgId;
                    return (
                      <div key={inquiry._id} className="p-4 hover:bg-surface-container-low transition-colors hover:scale-[1.02] hover:shadow-md">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full ${color.bg} ${color.text} flex items-center justify-center font-h2 text-body-md shrink-0`}>
                            {getInitials(student?.name || 'UN')}
                          </div>
                          <div>
                            <h4 className="font-h2 text-body-md text-on-surface">{student?.name || 'Unknown Student'}</h4>
                            <p className="font-body-md text-label-sm text-on-surface-variant">
                              Interested in: {pg?.title || 'Unknown PG'}
                            </p>
                            <p className="font-label-sm text-[10px] text-outline mt-1">{timeAgo(inquiry.createdAt)}</p>
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
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2 block">inbox</span>
                    <p className="font-body-md text-on-surface-variant">No new inquiries yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
