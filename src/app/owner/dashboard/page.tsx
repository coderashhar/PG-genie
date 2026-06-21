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
import AddPropertyButton from '@/components/dashboard/AddPropertyButton';
import ListingsList from '@/components/dashboard/ListingsList';
import InquiriesList from '@/components/dashboard/InquiriesList';

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
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

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
              <h1 className="font-display text-[40px] md:text-[64px] leading-[1.1] text-primary mb-2">
                Welcome back,<br className="md:hidden" /> {userName.split(' ')[0]}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Here is an overview of your properties and leads.</p>
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
              <section className="grid grid-cols-3 gap-2 md:gap-stack-md">
                <div className="bg-surface-container rounded-xl p-2 md:p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container-high relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all flex flex-col justify-between">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-fixed rounded-full opacity-20"></div>
                  <div className="flex justify-between items-start mb-1 md:mb-4 relative z-10">
                    <div className="p-1 md:p-3 bg-surface rounded-lg text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined fill text-[18px] md:text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>apartment</span>
                    </div>
                    <span className="hidden md:inline-flex bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
                      +{stats.newListingsThisMonth} this month
                    </span>
                    <span className="md:hidden bg-secondary-container text-on-secondary-container px-1 py-0.5 rounded-full text-[8px] font-bold">
                      +{stats.newListingsThisMonth}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-label-sm text-[10px] md:text-body-md md:font-body-md text-on-surface-variant mb-0 md:mb-1 relative z-10 truncate">Listings</h3>
                    <p className="font-display text-[20px] md:text-h1 text-on-surface relative z-10 leading-none">{stats.totalListings}</p>
                  </div>
                </div>

                <div className="bg-primary-container rounded-xl p-2 md:p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all text-on-primary-container flex flex-col justify-between">
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-primary opacity-10 rounded-tl-full"></div>
                  <div className="flex justify-between items-start mb-1 md:mb-4 relative z-10">
                    <div className="p-1 md:p-3 bg-surface/20 rounded-lg text-on-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined fill text-[18px] md:text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                    </div>
                    <span className="hidden md:flex bg-surface/20 px-3 py-1 rounded-full font-label-sm text-label-sm items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      {stats.unreadInquiries} Unread
                    </span>
                    <span className="md:hidden bg-surface/20 px-1 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      {stats.unreadInquiries}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-label-sm text-[10px] md:text-body-md md:font-body-md text-on-primary-container/80 mb-0 md:mb-1 relative z-10 truncate">Leads</h3>
                    <p className="font-display text-[20px] md:text-h1 relative z-10 leading-none">{stats.activeLeads}</p>
                  </div>
                </div>

                <div className="bg-surface-container rounded-xl p-2 md:p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container-high relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all flex flex-col justify-between">
                  <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-secondary-fixed rounded-full opacity-20"></div>
                  <div className="flex justify-between items-start mb-1 md:mb-4 relative z-10">
                    <div className="p-1 md:p-3 bg-surface rounded-lg text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined fill text-[18px] md:text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                    </div>
                    <span className="hidden md:flex bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        {stats.viewsChangePercent >= 0 ? 'trending_up' : 'trending_down'}
                      </span>
                      {Math.abs(stats.viewsChangePercent)}%
                    </span>
                    <span className="md:hidden bg-secondary-container text-on-secondary-container px-1 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">
                        {stats.viewsChangePercent >= 0 ? 'trending_up' : 'trending_down'}
                      </span>
                      {Math.abs(stats.viewsChangePercent)}%
                    </span>
                  </div>
                  <div>
                    <h3 className="font-label-sm text-[10px] md:text-body-md md:font-body-md text-on-surface-variant mb-0 md:mb-1 relative z-10 truncate">Views</h3>
                    <p className="font-display text-[20px] md:text-h1 text-on-surface relative z-10 leading-none">
                      {stats.viewsThisMonth >= 1000 ? (stats.viewsThisMonth / 1000).toFixed(1) + 'k' : stats.viewsThisMonth}
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
                {/* Your Listings */}
                <section className="lg:col-span-2 space-y-stack-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-h2 text-h2 text-on-surface">Your Listings</h2>
                  </div>

                  <ListingsList initialListings={dashData.listings} />
                </section>

                {/* Recent Inquiries */}
                <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-outline-variant/50 p-6 h-fit sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-h2 text-h2 text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">mark_email_unread</span>
                      Recent Inquiries
                    </h2>
                  </div>

                  <InquiriesList initialInquiries={dashData.inquiries} />
                </section>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-stack-md mb-6 md:mb-stack-lg">
                <div className="col-span-1 md:col-span-1 bg-surface-container rounded-xl p-4 md:p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative mb-2 md:mb-stack-sm w-20 h-20 md:w-32 md:h-32">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-primary flex items-center justify-center relative group">
                      <span className="text-on-primary font-display text-2xl md:text-4xl">{getInitials(dashData.owner.name)}</span>
                    </div>
                  </div>
                  <h1 className="font-h1 text-[24px] md:text-h1 text-on-background mb-1">{userName}</h1>
                  <p className="font-body-md text-sm md:text-body-md text-on-surface-variant flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>store</span>
                    {dashData.owner.businessName || 'Property Owner'}
                  </p>
                </div>

                <div className="col-span-1 md:col-span-2 bg-surface-container rounded-xl p-4 md:p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col justify-center">
                  <h2 className="font-h2 text-[20px] md:text-h2 text-on-background flex items-center gap-2 mb-4 md:mb-stack-md">
                    <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]">account_circle</span>
                    Business Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="flex items-center gap-3 bg-surface p-3 md:p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]">mail</span>
                      <div>
                        <p className="font-label-sm text-[11px] md:text-label-sm text-on-surface-variant">Email</p>
                        <p className="font-body-md text-sm md:text-body-md text-on-surface">{dashData.owner.email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-surface p-3 md:p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]">call</span>
                      <div>
                        <p className="font-label-sm text-[11px] md:text-label-sm text-on-surface-variant">Phone</p>
                        <p className="font-body-md text-sm md:text-body-md text-on-surface">{dashData.owner.phone || '—'}</p>
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex items-center gap-3 bg-surface p-3 md:p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]">location_on</span>
                      <div>
                        <p className="font-label-sm text-[11px] md:text-label-sm text-on-surface-variant">Business Address</p>
                        <p className="font-body-md text-sm md:text-body-md text-on-surface">{dashData.owner.businessAddress || '—'}</p>
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
