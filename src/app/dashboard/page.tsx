"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import ImageUpload from '@/components/ImageUpload';
import PropertyCard from '@/components/PropertyCard';

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

function DashboardContent() {
  const { data: session, status: sessionStatus, update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') === 'profile' ? 'profile' : 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Sync tab with URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'profile' || tab === 'overview') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'overview' | 'profile') => {
    setActiveTab(tab);
    router.push(`/dashboard${tab === 'profile' ? '?tab=profile' : ''}`);
  };

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

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [sessionStatus, router]);

  const handleDeleteBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Booking removed successfully');
        setDashData(prev => prev ? {
          ...prev,
          bookings: prev.bookings.filter(b => b._id !== id)
        } : prev);
        setActiveDropdown(null);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to remove booking');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  // Fetch Profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/users/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProfileLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleImageUpload = async (url: string) => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: url }),
      });
      if (res.ok) {
        setProfile((prev: any) => ({ ...prev, image: url }));
        update({ image: url }); // Update next-auth session locally
      }
    } catch (err) {
      console.error('Failed to update profile image', err);
    }
  };

  // Derive user info
  const userName = profile?.name || dashData?.user?.name || session?.user?.name || 'Student';
  const userInitial = userName.charAt(0).toUpperCase();
  const displayImage = profile?.image || session?.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';

  // Filter upcoming visits
  const upcomingVisits = (dashData?.bookings || []).filter((b) => {
    if (!b.visitDate) return false;
    return new Date(b.visitDate) >= new Date();
  });

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen">
      {/* Main Content Canvas */}
      <main className="w-full flex flex-col min-h-screen">
        
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

          {/* Tab Navigation */}
          <div className="flex border-b border-surface-container mb-stack-lg gap-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <button
              onClick={() => handleTabChange('overview')}
              className={`pb-3 font-h2 text-h2 transition-colors border-b-2 ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface cursor-pointer'}`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange('profile')}
              className={`pb-3 font-h2 text-h2 transition-colors border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface cursor-pointer'}`}
            >
              Profile & Settings
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-error-container text-on-error-container p-6 rounded-xl mb-stack-lg flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              <p>{error}</p>
            </div>
          )}

          {activeTab === 'overview' ? (
            /* Dashboard Overview Grid Layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
              {/* Main Column (Saved PGs & Applications) */}
              <div className="lg:col-span-2 flex flex-col gap-stack-lg">
                
                {/* Saved PGs */}
                <section>
                  <div className="flex justify-between items-center mb-stack-md">
                    <h2 className="font-h1 text-h1 text-on-surface">Saved PGs</h2>
                    {dashData && dashData.savedPgs.length > 2 && (
                      <Link href="/dashboard/saved" className="text-primary hover:text-primary-fixed-dim hover:translate-x-1 transition-all duration-300 font-label-sm text-label-sm flex items-center gap-1 cursor-pointer">
                        View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    {loading ? (
                      <>
                        <CardSkeleton />
                        <CardSkeleton />
                      </>
                    ) : dashData && dashData.savedPgs.length > 0 ? (
                      dashData.savedPgs.slice(0, 2).map((pg) => (
                        <PropertyCard
                          key={pg._id}
                          property={pg}
                          initialIsSaved={true}
                          onSaveToggle={(pgId, isSaved) => {
                            if (!isSaved) {
                              setDashData(prev => prev ? {
                                ...prev,
                                savedPgs: prev.savedPgs.filter(p => p._id !== pgId)
                              } : prev);
                            }
                          }}
                        />
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
  
                {/* Booked Visits */}
                <section>
                  <h2 className="font-h1 text-h1 text-on-surface mb-stack-md">Booked Visits</h2>
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
                                    Booked on {formatDate(booking.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1`}>
                                  <span className="material-symbols-outlined text-xs">{config.icon}</span>
                                  {config.label}
                                </span>
                                <button
                                  className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error transition-colors cursor-pointer group"
                                  title="Remove"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteBooking(booking._id);
                                  }}
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
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
          ) : (
            /* Profile Tab Layout */
            <div className="flex flex-col">
              {/* Profile Header Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-lg">
                {/* User Avatar & Identity Card */}
                <div className="col-span-1 md:col-span-1 bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative mb-stack-sm w-32 h-32">
                    {!profileLoading && (
                      <ImageUpload
                        shape="circle"
                        defaultImage={displayImage}
                        onUploadSuccess={handleImageUpload}
                        label="Avatar"
                      />
                    )}
                  </div>
                  <h1 className="font-h1 text-h1 text-on-background mb-1">{userName}</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>school</span>
                    VIT Bhopal
                  </p>
                  <div className="mt-4 inline-block bg-primary-container/10 text-primary rounded-full px-4 py-1 font-label-sm text-label-sm">
                    Batch of 2026
                  </div>
                </div>

                {/* Verification Status Card */}
                <div className="col-span-1 md:col-span-2 bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col justify-between">
                  <div>
                    <h2 className="font-h2 text-h2 text-on-background flex items-center gap-2 mb-stack-sm">
                      <span className="material-symbols-outlined text-secondary">verified_user</span>
                      Document Verification
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">Complete your profile to unlock instant bookings and connect with verified owners.</p>
                  </div>
                  <div className="space-y-4">
                    {/* Aadhar Status */}
                    <div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-surface-variant transition-all duration-300 cursor-pointer hover:bg-surface-container-low hover:border-primary/30">
                      <div className="flex items-center gap-4">
                        <div className="bg-secondary/10 p-2 rounded-full text-secondary flex items-center justify-center">
                          <span className="material-symbols-outlined">credit_card</span>
                        </div>
                        <div>
                          <h3 className="font-body-lg text-body-lg font-bold text-on-background">Aadhar Card</h3>
                          <p className="font-label-sm text-label-sm text-secondary">Verified</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-secondary">check_circle</span>
                    </div>
                    
                    {/* Student ID Status */}
                    <div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-outline-variant transition-all duration-300 cursor-pointer hover:bg-surface-container-low hover:border-primary/30">
                      <div className="flex items-center gap-4">
                        <div className="bg-surface-variant p-2 rounded-full text-on-surface-variant flex items-center justify-center">
                          <span className="material-symbols-outlined">badge</span>
                        </div>
                        <div>
                          <h3 className="font-body-lg text-body-lg font-bold text-on-background">Student ID</h3>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">Pending Upload</p>
                        </div>
                      </div>
                      <button className="bg-primary-container/10 text-primary hover:bg-primary-container hover:text-on-primary px-4 py-2 rounded-full font-label-sm text-label-sm transition-colors border border-primary cursor-pointer">
                        Upload Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <h2 className="font-h2 text-h2 text-on-background mb-stack-md">Accommodation Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
                {/* Budget Range */}
                <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-2 mb-stack-sm text-primary">
                    <span className="material-symbols-outlined">payments</span>
                    <h3 className="font-body-lg text-body-lg font-bold text-on-background">Monthly Budget</h3>
                  </div>
                  <div className="mt-stack-sm">
                    <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-2">
                      <span>₹4,000</span>
                      <span>₹12,000+</span>
                    </div>
                    {/* Custom Range Slider Visual */}
                    <div className="relative w-full h-2 bg-surface-variant rounded-full mt-4">
                      <div className="absolute top-0 left-1/4 right-1/4 h-full bg-primary rounded-full"></div>
                      <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-primary rounded-full shadow border-2 border-surface transform -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-primary rounded-full shadow border-2 border-surface transform translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <p className="font-body-md text-body-md text-center mt-4 font-bold text-primary">₹6,000 - ₹9,000</p>
                  </div>
                </div>

                {/* Room Type */}
                <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-2 mb-stack-sm text-primary">
                    <span className="material-symbols-outlined">bed</span>
                    <h3 className="font-body-lg text-body-lg font-bold text-on-background">Preferred Room Type</h3>
                  </div>
                  <div className="flex flex-col gap-3 mt-stack-sm">
                    <label className="flex items-center justify-between p-3 rounded-lg border border-primary bg-primary-container/5 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">person</span>
                        <span className="font-body-md text-body-md text-on-background">Single Room</span>
                      </div>
                      <input defaultChecked className="text-primary focus:ring-primary h-5 w-5 border-outline-variant" name="room_type" type="radio" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-on-surface-variant">group</span>
                        <span className="font-body-md text-body-md text-on-background">Shared Room (2-3)</span>
                      </div>
                      <input className="text-primary focus:ring-primary h-5 w-5 border-outline-variant" name="room_type" type="radio" />
                    </label>
                  </div>
                </div>
                {/* Dietary Preferences */}
                <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-2 mb-stack-sm text-primary">
                    <span className="material-symbols-outlined">restaurant</span>
                    <h3 className="font-body-lg text-body-lg font-bold text-on-background">Dietary Preference</h3>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-stack-sm">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-secondary bg-secondary/10 text-secondary font-label-sm text-label-sm transition-all duration-300 hover:scale-105 hover:shadow-sm cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      Veg
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface transition-all duration-300 hover:scale-105 hover:shadow-sm cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-error"></div>
                      Non-Veg
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface transition-all duration-300 hover:scale-105 hover:shadow-sm cursor-pointer">
                      <div className="w-3 h-3 rounded-full border-2 border-outline-variant"></div>
                      Any
                    </button>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-4 text-sm">Helps us recommend PGs with suitable mess facilities.</p>
                </div>
              </div>

              <div className="mt-stack-lg flex justify-end">
                <button className="bg-primary text-on-primary hover:bg-primary-container px-8 py-3 rounded-lg font-body-lg text-body-lg font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-1 hover:shadow-[0px_8px_30px_rgba(76,29,149,0.2)] cursor-pointer">
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-display text-primary text-2xl">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
