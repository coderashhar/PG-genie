import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import OwnerDashboardPage from '../owner/dashboard/page';

import PropertyCard from '@/components/PropertyCard';
import EditProfileForm from '@/components/dashboard/EditProfileForm';
import DeleteBookingButton from '@/components/dashboard/DeleteBookingButton';

// --- Types for DB Data ---
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
    phone?: string;
    batch?: string;
  };
  savedPgs: SavedPg[];
  bookings: BookingData[];
}

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

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-display text-primary text-2xl">
        Please log in to view your dashboard.
      </div>
    );
  }

  const isOwner = (session.user as any).role === 'owner';

  if (isOwner) {
    // If owner, return Owner Dashboard Server Component directly
    // @ts-ignore
    return <OwnerDashboardPage searchParams={searchParams} />;
  }

  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab === 'profile' ? 'profile' : 'overview';

  await connectToDatabase();
  const userId = (session.user as any).id;

  // Fetch Dashboard Data directly
  const [user, bookings] = await Promise.all([
    User.findById(userId)
      .select('-password')
      .populate({
        path: 'savedPgs',
        model: Property,
        select: 'title description location price images status amenities roomTypes views furniture attachedBath waterSupply geyser wifi backupPower cctv washingMachine petFriendly',
      })
      .lean(),
    Booking.find({ studentId: userId })
      .populate({
        path: 'pgId',
        model: Property,
        select: 'title location images price',
      })
      .sort({ createdAt: -1 })
      .lean()
  ]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-display text-primary text-2xl">
        User not found.
      </div>
    );
  }

  const dashData: DashboardData = {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      university: user.university,
      phone: user.phone,
      batch: user.batch,
    },
    savedPgs: JSON.parse(JSON.stringify(user.savedPgs || [])),
    bookings: JSON.parse(JSON.stringify(bookings || [])),
  };

  const userName = dashData.user.name || 'Student';
  const userInitial = userName.charAt(0).toUpperCase();

  // Filter upcoming visits
  const upcomingVisits = dashData.bookings.filter((b) => {
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
              Welcome back, {userName.split(' ')[0]}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Here is an overview of your housing search.</p>
          </header>

          {/* Tab Navigation */}
          <div className="flex border-b border-surface-container mb-stack-lg gap-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link
              href="/dashboard?tab=overview"
              className={`pb-3 font-h2 text-h2 transition-colors border-b-2 ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface cursor-pointer'}`}
            >
              Overview
            </Link>
            <Link
              href="/dashboard?tab=profile"
              className={`pb-3 font-h2 text-h2 transition-colors border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface cursor-pointer'}`}
            >
              Profile & Settings
            </Link>
          </div>

          {activeTab === 'overview' ? (
            /* Dashboard Overview Grid Layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
              {/* Main Column (Saved PGs & Applications) */}
              <div className="lg:col-span-2 flex flex-col gap-stack-lg">
                
                {/* Saved PGs */}
                <section>
                  <div className="flex justify-between items-center mb-stack-md">
                    <h2 className="font-h1 text-h1 text-on-surface">Saved PGs</h2>
                    {dashData.savedPgs.length > 2 && (
                      <Link href="/dashboard/saved" className="text-primary hover:text-primary-fixed-dim hover:translate-x-1 transition-all duration-300 font-label-sm text-label-sm flex items-center gap-1 cursor-pointer">
                        View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    {dashData.savedPgs.length > 0 ? (
                      dashData.savedPgs.slice(0, 2).map((pg) => (
                        <PropertyCard
                          key={pg._id}
                          property={pg}
                          initialIsSaved={true}
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
                    {dashData.bookings.length > 0 ? (
                      <ul className="divide-y divide-surface-container">
                        {dashData.bookings.map((booking) => {
                          const config = statusConfig[booking.status];
                          const property = booking.pgId;
                          return (
                            <div key={booking._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container transition-colors">
                              <Link href={`/pgs/${property?._id || '#'}`} className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                                  <Image
                                    alt="PG Thumbnail"
                                    fill
                                    className="object-cover"
                                    src={property?.images?.[0] || '/placeholder.jpg'}
                                  />
                                </div>
                                <div>
                                  <h3 className="font-h2 text-h2 text-on-surface hover:underline">{property?.title || 'Unknown PG'}</h3>
                                  <p className="font-body-md text-body-md text-on-surface-variant">
                                    Booked on {formatDate(booking.createdAt)}
                                  </p>
                                </div>
                              </Link>
                              <div className="flex items-center gap-3">
                                <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1`}>
                                  <span className="material-symbols-outlined text-xs">{config.icon}</span>
                                  {config.label}
                                </span>
                                <DeleteBookingButton bookingId={booking._id} />
                              </div>
                            </div>
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
                  {upcomingVisits.length > 0 ? (
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
              {/* Profile Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-lg">
                {/* User Avatar & Identity Card */}
                <div className="col-span-1 md:col-span-1 bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative mb-stack-sm w-32 h-32">
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center relative group">
                      <span className="text-on-primary font-display text-4xl">{userInitial}</span>
                    </div>
                  </div>
                  <h1 className="font-h1 text-h1 text-on-background mb-1">{userName}</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>school</span>
                    {dashData.user.university || 'University'}
                  </p>
                  {dashData.user.batch && (
                    <div className="mt-4 inline-block bg-primary-container/10 text-primary rounded-full px-4 py-1 font-label-sm text-label-sm">
                      Batch of {dashData.user.batch}
                    </div>
                  )}
                </div>

                {/* Quick Info Card */}
                <div className="col-span-1 md:col-span-2 bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col justify-center">
                  <h2 className="font-h2 text-h2 text-on-background flex items-center gap-2 mb-stack-md">
                    <span className="material-symbols-outlined text-primary">account_circle</span>
                    Account Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary">mail</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Email</p>
                        <p className="font-body-md text-body-md text-on-surface">{dashData.user.email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary">call</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Phone</p>
                        <p className="font-body-md text-body-md text-on-surface">{dashData.user.phone || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary">badge</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Role</p>
                        <p className="font-body-md text-body-md text-on-surface capitalize">{dashData.user.role || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary">calendar_month</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Batch</p>
                        <p className="font-body-md text-body-md text-on-surface">{dashData.user.batch || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <EditProfileForm profile={dashData.user} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
