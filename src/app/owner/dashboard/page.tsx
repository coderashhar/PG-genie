import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';

import OwnerEditProfileForm from '@/components/dashboard/OwnerEditProfileForm';
import PropertyStatusToggle from '@/components/dashboard/PropertyStatusToggle';
import InquiryActionButtons from '@/components/dashboard/InquiryActionButtons';
import DeletePropertyButton from '@/components/dashboard/DeletePropertyButton';
import AddPropertyButton from '@/components/dashboard/AddPropertyButton';
import EditPropertyButton from '@/components/dashboard/EditPropertyButton';

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
    role: string;
    phone?: string;
    businessName?: string;
    businessAddress?: string;
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

// --- Inquiry Card Colors ---
const inquiryColors = [
  { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  { bg: 'bg-primary-container', text: 'text-on-primary-container' },
];

export default async function OwnerDashboardPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-display text-primary text-2xl">
        Unauthorized. Please log in.
      </div>
    );
  }

  if ((session.user as any).role !== 'owner') {
    return (
      <div className="min-h-screen flex items-center justify-center font-display text-primary text-2xl">
        Forbidden. Owner access only.
      </div>
    );
  }

  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab === 'profile' ? 'profile' : 'overview';

  await connectToDatabase();
  const userId = (session.user as any).id;

  // Fetch data
  const [owner, listings, inquiries] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Property.find({ ownerId: userId }).sort({ createdAt: -1 }).lean(),
    Booking.find({ ownerId: userId })
      .populate({
        path: 'studentId',
        model: User,
        select: 'name email image phone',
      })
      .populate({
        path: 'pgId',
        model: Property,
        select: 'title',
      })
      .sort({ createdAt: -1 })
      .lean()
  ]);

  if (!owner) {
    return (
      <div className="min-h-screen flex items-center justify-center font-display text-primary text-2xl">
        User not found.
      </div>
    );
  }

  // Compute stats
  const totalListings = listings.length;
  const activeLeads = inquiries.filter((b: any) => b.status === 'pending').length;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  let viewsThisMonth = 0;
  let viewsLastMonth = 0;
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  for (const property of listings) {
    for (const mv of property.monthlyViews || []) {
      if (mv.month === currentMonth && mv.year === currentYear) {
        viewsThisMonth += mv.count;
      }
      if (mv.month === lastMonth && mv.year === lastMonthYear) {
        viewsLastMonth += mv.count;
      }
    }
  }

  const viewsChangePercent =
    viewsLastMonth > 0
      ? Math.round(((viewsThisMonth - viewsLastMonth) / viewsLastMonth) * 100)
      : viewsThisMonth > 0
        ? 100
        : 0;

  const newListingsThisMonth = listings.filter((l: any) => {
    const created = new Date(l.createdAt);
    return created.getMonth() + 1 === currentMonth && created.getFullYear() === currentYear;
  }).length;

  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const unreadInquiries = inquiries.filter(
    (b: any) => b.status === 'pending' && new Date(b.createdAt) >= twoDaysAgo
  ).length;

  const dashData: OwnerDashboardData = {
    owner: {
      id: owner._id.toString(),
      name: owner.name,
      email: owner.email,
      role: owner.role,
      phone: owner.phone,
      businessName: owner.businessName,
      businessAddress: owner.businessAddress,
    },
    listings: JSON.parse(JSON.stringify(listings)),
    inquiries: JSON.parse(JSON.stringify(inquiries)),
    stats: {
      totalListings,
      activeLeads,
      unreadInquiries,
      viewsThisMonth,
      viewsChangePercent,
      newListingsThisMonth,
    },
  };

  const userName = dashData.owner.name || 'Owner';
  const stats = dashData.stats;

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen">
      <main className="w-full flex flex-col min-h-screen">
        <div className="flex-1 w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto py-stack-md md:py-stack-lg">
          <header className="mb-stack-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-display text-primary mb-2">
                Owner Dashboard
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your properties and leads.</p>
            </div>
            <AddPropertyButton />
          </header>

          {/* Tab Navigation */}
          <div className="flex border-b border-surface-container mb-stack-lg gap-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link
              href="/owner/dashboard?tab=overview"
              className={`pb-3 font-h2 text-h2 transition-colors border-b-2 ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface cursor-pointer'}`}
            >
              Overview
            </Link>
            <Link
              href="/owner/dashboard?tab=profile"
              className={`pb-3 font-h2 text-h2 transition-colors border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface cursor-pointer'}`}
            >
              Profile & Settings
            </Link>
          </div>

          {activeTab === 'overview' ? (
            <div className="space-y-stack-lg">
              {/* Stats Overview */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container-high relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-fixed rounded-full opacity-20"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-surface rounded-lg text-primary">
                      <span className="material-symbols-outlined fill text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>apartment</span>
                    </div>
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
                      +{stats.newListingsThisMonth} this month
                    </span>
                  </div>
                  <h3 className="font-body-md text-body-md text-on-surface-variant mb-1 relative z-10">Total Listings</h3>
                  <p className="font-display text-h1 text-on-surface relative z-10">{stats.totalListings}</p>
                </div>

                <div className="bg-primary-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all text-on-primary-container">
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-primary opacity-10 rounded-tl-full"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-surface/20 rounded-lg text-on-primary-container">
                      <span className="material-symbols-outlined fill text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                    </div>
                    <span className="bg-surface/20 px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      {stats.unreadInquiries} Unread
                    </span>
                  </div>
                  <h3 className="font-body-md text-body-md text-on-primary-container/80 mb-1 relative z-10">Active Leads</h3>
                  <p className="font-display text-h1 relative z-10">{stats.activeLeads}</p>
                </div>

                <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container-high relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all">
                  <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-secondary-fixed rounded-full opacity-20"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-surface rounded-lg text-secondary">
                      <span className="material-symbols-outlined fill text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                    </div>
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        {stats.viewsChangePercent >= 0 ? 'trending_up' : 'trending_down'}
                      </span>
                      {Math.abs(stats.viewsChangePercent)}%
                    </span>
                  </div>
                  <h3 className="font-body-md text-body-md text-on-surface-variant mb-1 relative z-10">Views this Month</h3>
                  <p className="font-display text-h1 text-on-surface relative z-10">
                    {stats.viewsThisMonth.toLocaleString('en-IN')}
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
                {/* Your Listings */}
                <section className="lg:col-span-2 space-y-stack-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-h2 text-h2 text-on-surface">Your Listings</h2>
                    <Link href="/pgs" className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer">View All</Link>
                  </div>

                  <div className="space-y-4">
                    {dashData.listings.length > 0 ? (
                      dashData.listings.map((listing) => (
                        <div key={listing._id} className="rounded-xl p-4 border border-outline-variant/50 flex flex-col sm:flex-row gap-4 bg-surface-container-lowest hover:border-primary/30 transition-all shadow-sm">
                          <div className="w-full sm:w-48 h-32 rounded-lg relative overflow-hidden flex-shrink-0">
                            <Image 
                              src={listing.images[0] || '/placeholder.jpg'} 
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                              {listing.status === 'pending' && (
                                <span className="bg-tertiary text-on-tertiary px-2 py-1 rounded font-label-sm text-xs shadow-sm flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">pending_actions</span>
                                  Pending Review
                                </span>
                              )}
                              {listing.status === 'active' && (
                                <span className="bg-primary text-on-primary px-2 py-1 rounded font-label-sm text-xs shadow-sm flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                  Available
                                </span>
                              )}
                              {listing.status === 'inactive' && (
                                <span className="bg-surface-variant text-on-surface-variant px-2 py-1 rounded font-label-sm text-xs shadow-sm flex items-center gap-1 opacity-90">
                                  <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                                  Filled
                                </span>
                              )}
                            </div>
                            {/* Optional: Add a very subtle greyscale overlay to the image if it's inactive so it looks 'disabled', but not pitch black */}
                            {listing.status === 'inactive' && (
                              <div className="absolute inset-0 bg-surface/30 mix-blend-saturation pointer-events-none z-0"></div>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-h2 text-body-lg text-on-surface hover:text-primary transition-colors cursor-pointer">
                                    <Link href={`/pgs/${listing._id}`}>{listing.title}</Link>
                                  </h3>
                                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                                    {listing.location.address}, {listing.location.city}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-h2 text-primary">₹{listing.price.toLocaleString('en-IN')}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 sm:mt-0 pt-4 border-t border-outline-variant/30">
                              <div className="flex items-center gap-4 text-on-surface-variant">
                                <div className="flex items-center gap-1 font-label-sm text-label-sm">
                                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                                  {listing.views}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <PropertyStatusToggle propertyId={listing._id} initialStatus={listing.status} />
                                <EditPropertyButton property={listing} />
                                <DeletePropertyButton propertyId={listing._id} propertyTitle={listing.title} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-surface-container rounded-xl">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">apartment</span>
                        <p className="font-body-lg text-on-surface-variant mb-4">You haven&apos;t added any properties yet.</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Recent Inquiries */}
                <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-outline-variant/50 p-6 h-fit sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-h2 text-h2 text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">mark_email_unread</span>
                      Recent Inquiries
                    </h2>
                  </div>

                  {dashData.inquiries.length > 0 ? (
                    <div className="space-y-4">
                      {dashData.inquiries.slice(0, 5).map((inquiry, index) => {
                        const isPending = inquiry.status === 'pending';
                        const colorClass = inquiryColors[index % inquiryColors.length];

                        return (
                          <div key={inquiry._id} className={`p-4 rounded-xl border transition-all ${isPending ? 'bg-surface border-primary/20 shadow-sm' : 'bg-surface-container/50 border-transparent'}`}>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-h2 text-body-lg ${colorClass.bg} ${colorClass.text}`}>
                                  {getInitials(inquiry.studentId?.name || 'Student')}
                                </div>
                                <div>
                                  <h4 className="font-h2 text-body-md text-on-surface">{inquiry.studentId?.name || 'Student'}</h4>
                                  <p className="font-label-sm text-xs text-on-surface-variant">{timeAgo(inquiry.createdAt)}</p>
                                </div>
                              </div>
                              {!isPending && (
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-sm ${inquiry.status === 'accepted' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                                  {inquiry.status}
                                </span>
                              )}
                            </div>

                            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2">
                              Interested in <span className="font-semibold text-on-surface">{inquiry.pgId?.title || 'Unknown Property'}</span>. {inquiry.message}
                            </p>

                            <div className="flex flex-col gap-2 mt-auto pt-2">
                              {inquiry.status === 'pending' && (
                                <InquiryActionButtons bookingId={String(inquiry._id)} />
                              )}

                              <a
                                href={inquiry.studentId?.phone ? `tel:${inquiry.studentId.phone}` : `mailto:${inquiry.studentId?.email}`}
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-container font-label-sm text-label-sm text-primary hover:bg-primary-container hover:text-on-primary-container hover:font-normal transition-all cursor-pointer text-center"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {inquiry.studentId?.phone ? 'call' : 'mail'}
                                </span>
                                Contact Student
                              </a>
                            </div>
                          </div>
                        );
                      })}
                      {dashData.inquiries.length > 5 && (
                        <button className="w-full mt-2 text-primary font-label-sm text-label-sm py-2 hover:bg-primary-container/5 transition-colors rounded-lg cursor-pointer">
                          View all {dashData.inquiries.length} inquiries
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">inbox</span>
                      <p className="font-body-sm text-on-surface-variant">No inquiries yet.</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-lg">
                <div className="col-span-1 md:col-span-1 bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative mb-stack-sm w-32 h-32">
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center relative group">
                      <span className="text-on-primary font-display text-4xl">{getInitials(dashData.owner.name)}</span>
                    </div>
                  </div>
                  <h1 className="font-h1 text-h1 text-on-background mb-1">{userName}</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>store</span>
                    {dashData.owner.businessName || 'Property Owner'}
                  </p>
                </div>

                <div className="col-span-1 md:col-span-2 bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col justify-center">
                  <h2 className="font-h2 text-h2 text-on-background flex items-center gap-2 mb-stack-md">
                    <span className="material-symbols-outlined text-primary">account_circle</span>
                    Business Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary">mail</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Email</p>
                        <p className="font-body-md text-body-md text-on-surface">{dashData.owner.email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary">call</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Phone</p>
                        <p className="font-body-md text-body-md text-on-surface">{dashData.owner.phone || '—'}</p>
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Business Address</p>
                        <p className="font-body-md text-body-md text-on-surface">{dashData.owner.businessAddress || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <OwnerEditProfileForm profile={dashData.owner} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
