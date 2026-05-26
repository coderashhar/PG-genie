"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

// --- Types for API response ---
interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode?: string;
}

interface SavedPg {
  _id: string;
  title: string;
  description: string;
  location: PropertyLocation;
  price: number;
  images: string[];
  status: string;
  amenities: string[];
  roomTypes: string[];
}

interface BookingProperty {
  _id: string;
  title: string;
  location: PropertyLocation;
  images: string[];
  price: number;
}

interface BookingData {
  _id: string;
  pgId: BookingProperty;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  visitDate?: string;
  visitTime?: string;
  createdAt: string;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
    university?: string;
  };
  savedPgs: SavedPg[];
  bookings: BookingData[];
}

// --- Amenity icon map ---
const amenityIconMap: Record<string, string> = {
  WiFi: 'wifi',
  'High-Speed WiFi': 'wifi',
  'Fiber Internet': 'wifi',
  'Basic WiFi': 'wifi',
  AC: 'ac_unit',
  'Central AC': 'ac_unit',
  Laundry: 'local_laundry_service',
  Meals: 'restaurant',
  'Premium Meals': 'restaurant',
  '3 Meals/Day': 'restaurant',
  Gym: 'fitness_center',
  'Gym Access': 'fitness_center',
  Garden: 'park',
  'Power Backup': 'bolt',
  CCTV: 'videocam',
  'Study Room': 'menu_book',
  'Study Zone': 'menu_book',
  Parking: 'local_parking',
  'Shuttle to Campus': 'directions_bus',
};

// --- Status badge config ---
const statusConfig: Record<string, { bg: string; text: string; icon: string; label: string }> = {
  pending: {
    bg: 'bg-tertiary-fixed',
    text: 'text-on-tertiary-fixed-variant',
    icon: 'pending',
    label: 'Pending',
  },
  accepted: {
    bg: 'bg-secondary-container',
    text: 'text-on-secondary-container',
    icon: 'check_circle',
    label: 'Approved',
  },
  rejected: {
    bg: 'bg-error-container',
    text: 'text-on-error-container',
    icon: 'cancel',
    label: 'Rejected',
  },
};

// --- Loading skeleton ---
function CardSkeleton() {
  return (
    <div className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] overflow-hidden border border-surface-container animate-pulse flex flex-col">
      <div className="w-full aspect-video bg-surface-container" />
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="h-5 bg-surface-container rounded w-3/4" />
        <div className="h-4 bg-surface-container rounded w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-14 bg-surface-container rounded" />
          <div className="h-6 w-14 bg-surface-container rounded" />
        </div>
        <div className="h-8 bg-surface-container rounded mt-auto" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="p-4 flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-surface-container" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-surface-container rounded" />
          <div className="h-3 w-24 bg-surface-container rounded" />
        </div>
      </div>
      <div className="h-6 w-20 bg-surface-container rounded-full" />
    </div>
  );
}

// --- Helper: format date ---
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatVisitDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export default function StudentDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) {
          if (res.status === 401) {
            setError('Please log in to view your dashboard.');
            return;
          }
          throw new Error('Failed to fetch dashboard data');
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
      fetchDashboard();
    }
  }, [sessionStatus]);

  // Derive user info from session or API data
  const userName = dashData?.user?.name || session?.user?.name || 'Student';
  const userInitial = userName.charAt(0).toUpperCase();

  // Filter upcoming visits (bookings with future visitDate)
  const upcomingVisits = (dashData?.bookings || []).filter((b) => {
    if (!b.visitDate) return false;
    return new Date(b.visitDate) >= new Date();
  });

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased md:flex min-h-screen">

      {/* SideNavBar (Web Only) */}
      <aside className="hidden md:flex h-full w-72 left-0 top-0 fixed z-50 bg-surface shadow-xl flex-col p-gutter">
        <div className="mb-stack-lg">
          <span className="font-display text-h2 text-primary mb-2 block cursor-default">PG Genie</span>
          <Link href="/dashboard/profile" className="flex items-center gap-4 mt-stack-md p-4 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-h2 group-hover:scale-105 transition-transform">
              {userInitial}
            </div>
            <div>
              <h2 className="font-h2 text-h2 text-on-surface group-hover:text-primary transition-colors">Student Portal</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {dashData?.user?.university || 'VIT Bhopal student'}
              </p>
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
        {/* TopNavBar */}
        <Navbar className="sticky top-0 z-40 shadow-sm bg-surface text-primary" />
        
        <div className="flex-1 w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto py-stack-md md:py-stack-lg">
          {/* Header Section */}
          <header className="mb-stack-lg">
            <h1 className="font-display text-display text-primary mb-2">
              {loading ? (
                <span className="inline-block h-10 w-72 bg-surface-container rounded animate-pulse" />
              ) : (
                `Welcome back, ${userName.split(' ')[0]}`
              )}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Here is an overview of your housing search.</p>
          </header>

          {/* Error State */}
          {error && (
            <div className="bg-error-container text-on-error-container p-6 rounded-xl mb-stack-lg flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              <p>{error}</p>
            </div>
          )}

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
                  {loading ? (
                    <>
                      <CardSkeleton />
                      <CardSkeleton />
                    </>
                  ) : dashData && dashData.savedPgs.length > 0 ? (
                    dashData.savedPgs.map((pg) => (
                      <Link
                        key={pg._id}
                        href={`/pgs/${pg._id}`}
                        className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] overflow-hidden border border-surface-container hover:shadow-xl hover:scale-[1.02] hover:border-primary-container transition-all duration-300 group cursor-pointer flex flex-col block"
                      >
                        <div className="relative w-full aspect-video">
                          <img
                            alt={pg.title}
                            className="w-full h-full object-cover"
                            src={pg.images?.[0] || '/placeholder.jpg'}
                          />
                          <div className="absolute top-3 right-3 bg-surface text-secondary px-2 py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-xs">verified</span> Verified
                          </div>
                          <button
                            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-surface transition-colors cursor-pointer"
                            onClick={(e) => e.preventDefault()}
                          >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                          </button>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-h2 text-h2 text-on-surface mb-1 group-hover:text-primary transition-colors">{pg.title}</h3>
                          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mb-3">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {pg.location?.address || 'Kothri, Bhopal'}
                          </p>
                          <div className="flex gap-2 mb-4 flex-wrap">
                            {pg.amenities?.slice(0, 3).map((amenity) => (
                              <span
                                key={amenity}
                                className="bg-primary-container/5 text-primary px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-xs">
                                  {amenityIconMap[amenity] || 'check_circle'}
                                </span>
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <div className="mt-auto pt-4 border-t border-surface-container flex justify-between items-center">
                            <div>
                              <span className="font-h2 text-h2 text-primary">₹{pg.price?.toLocaleString('en-IN')}</span>
                              <span className="font-body-md text-body-md text-on-surface-variant">/mo</span>
                            </div>
                            <button
                              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-primary-container transition-colors cursor-pointer"
                              onClick={(e) => e.preventDefault()}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="md:col-span-2 bg-surface-container rounded-xl p-8 text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">favorite_border</span>
                      <p className="font-body-lg text-on-surface-variant">No saved PGs yet. Start exploring!</p>
                      <Link href="/pgs" className="inline-block mt-4 bg-primary text-on-primary px-6 py-2 rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity">
                        Browse PGs
                      </Link>
                    </div>
                  )}
                </div>
              </section>

              {/* Applied PGs */}
              <section>
                <h2 className="font-h1 text-h1 text-on-surface mb-stack-md">Applied PGs</h2>
                <div className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container overflow-hidden">
                  {loading ? (
                    <ul className="divide-y divide-surface-container">
                      <li><ListSkeleton /></li>
                      <li><ListSkeleton /></li>
                    </ul>
                  ) : dashData && dashData.bookings.length > 0 ? (
                    <ul className="divide-y divide-surface-container">
                      {dashData.bookings.map((booking) => {
                        const config = statusConfig[booking.status];
                        const property = booking.pgId;
                        return (
                          <Link
                            key={booking._id}
                            href={`/pgs/${property?._id || '#'}`}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container transition-colors cursor-pointer block"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  alt="PG Thumbnail"
                                  className="w-full h-full object-cover"
                                  src={property?.images?.[0] || '/placeholder.jpg'}
                                />
                              </div>
                              <div>
                                <h3 className="font-h2 text-h2 text-on-surface">{property?.title || 'Unknown PG'}</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                  Applied on {formatDate(booking.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1`}>
                                <span className="material-symbols-outlined text-xs">{config.icon}</span>
                                {config.label}
                              </span>
                              <button
                                className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
                                onClick={(e) => e.preventDefault()}
                              >
                                <span className="material-symbols-outlined text-sm">more_vert</span>
                              </button>
                            </div>
                          </Link>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="p-8 text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">assignment</span>
                      <p className="font-body-lg text-on-surface-variant">No applications yet. Apply to a PG to get started!</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Side Column (Recent Visits & Activity) */}
            <div className="flex flex-col gap-stack-lg">
              {/* Upcoming Visits */}
              <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
                <h2 className="font-h2 text-h2 text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">event_available</span>
                  Upcoming Visits
                </h2>
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-24 bg-surface-container rounded-lg animate-pulse" />
                    <div className="h-24 bg-surface-container rounded-lg animate-pulse" />
                  </div>
                ) : upcomingVisits.length > 0 ? (
                  <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-surface-container">
                    {upcomingVisits.map((visit, index) => {
                      const property = visit.pgId;
                      const isFirst = index === 0;
                      return (
                        <div key={visit._id} className="relative pl-8">
                          <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10 ${
                            isFirst
                              ? 'bg-secondary text-on-secondary'
                              : 'bg-surface-container border-2 border-outline-variant'
                          }`}>
                            {isFirst && <div className="w-2 h-2 bg-on-secondary rounded-full"></div>}
                          </div>
                          <div className={`bg-surface border border-surface-container rounded-lg p-3 hover:border-${isFirst ? 'secondary' : 'primary-container'} transition-colors cursor-pointer ${!isFirst ? 'opacity-70' : ''}`}>
                            <p className={`font-label-sm text-label-sm ${isFirst ? 'text-secondary' : 'text-on-surface-variant'} mb-1`}>
                              {formatVisitDate(visit.visitDate!)}{visit.visitTime ? `, ${visit.visitTime}` : ''}
                            </p>
                            <h4 className="font-h2 text-body-lg text-on-surface mb-2">{property?.title || 'Unknown PG'}</h4>
                            <div className="flex gap-2">
                              <button className="flex-1 bg-surface-container text-primary py-1.5 rounded-md font-label-sm text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-colors text-center cursor-pointer">
                                Reschedule
                              </button>
                              <button className="w-10 bg-secondary text-on-secondary rounded-md flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer">
                                <span className="material-symbols-outlined text-sm">call</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2 block">event_busy</span>
                    <p className="font-body-md text-on-surface-variant">No upcoming visits scheduled.</p>
                  </div>
                )}
                <button className="w-full mt-4 text-primary font-label-sm text-label-sm py-2 hover:bg-primary-container/5 hover:text-primary-fixed-dim hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">
                  View All Schedule
                </button>
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
