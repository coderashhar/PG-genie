"use client";

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import PropertyModal from '@/components/PropertyModal';

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
  Furniture: 'chair',
  'Attached Bath': 'bathtub',
  'Water Supply': 'water_drop',
  Geyser: 'heat_pump',
  'Backup Power': 'battery_charging_full',
  CCTV: 'videocam',
  'Washing Machine': 'local_laundry_service',
  'Pet Friendly': 'pets',
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

// --- Edit Profile Form for Owners ---
function OwnerEditProfileForm({ profile, setProfile }: { profile: any; setProfile: (p: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessAddress: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      let phoneStr = profile.phone || '';
      if (phoneStr.startsWith('+91')) {
        phoneStr = phoneStr.slice(3).trim();
      }

      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: phoneStr,
        businessName: profile.businessName || '',
        businessAddress: profile.businessAddress || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setSaving(false);
      return;
    }

    const phoneFull = formData.phone ? `+91${formData.phone}` : '';
    if (formData.phone && formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      setSaving(false);
      return;
    }

    const updates: Record<string, string> = {};
    if (formData.name && formData.name !== profile?.name) updates.name = formData.name;
    if (formData.email && formData.email !== profile?.email) updates.email = formData.email;
    if (phoneFull !== (profile?.phone || '')) updates.phone = phoneFull;
    if (formData.businessName !== (profile?.businessName || '')) updates.businessName = formData.businessName;
    if (formData.businessAddress !== (profile?.businessAddress || '')) updates.businessAddress = formData.businessAddress;

    if (Object.keys(updates).length === 0) {
      toast.error('No changes to save');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');
        setProfile(data.user);
      } else {
        const errorMsg = data.details ? data.details.join(', ') : data.error;
        toast.error(errorMsg || 'Failed to update profile');
      }
    } catch {
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-surface-container border border-outline-variant rounded-lg pl-12 pr-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)]">
      <h2 className="font-h2 text-h2 text-on-background flex items-center gap-2 mb-stack-md">
        <span className="material-symbols-outlined text-primary">edit</span>
        Edit Profile
      </h2>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </span>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Your full name" />
            </div>
          </div>

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="your@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant font-body-md border-r border-outline-variant pr-3">+91</span>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-lg pl-16 pr-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="9876543210" />
            </div>
          </div>

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Business/PG Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">business</span>
              </span>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className={inputClass} placeholder="e.g. Sharma Properties" />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Business Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </span>
              <input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleChange} className={inputClass} placeholder="Enter your full business address" />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={saving} className="bg-primary text-on-primary hover:bg-primary/90 px-8 py-3 rounded-xl font-h2 font-bold text-body-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer">
            {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function OwnerDashboardContent() {
  const { data: session, status: sessionStatus } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') === 'profile' ? 'profile' : 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  
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
    router.push(`/owner/dashboard${tab === 'profile' ? '?tab=profile' : ''}`);
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

  const [dashData, setDashData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal State
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<ListingData | null>(null);

  // Delete confirmation state
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchOwnerDashboard = useCallback(async () => {
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
  }, []);

  useEffect(() => {

    if (sessionStatus !== 'loading') {
      fetchOwnerDashboard();
    }
  }, [sessionStatus, refreshKey, fetchOwnerDashboard]);

  const handleStatusToggle = async (propertyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`Property marked as ${newStatus === 'active' ? 'Available' : 'Filled'}`);
      setRefreshKey(k => k + 1);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleInquiryAction = async (bookingId: string, action: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error(`Failed to ${action} booking`);
      toast.success(`Inquiry ${action} successfully!`);
      setRefreshKey(k => k + 1);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteProperty = async () => {
    if (!deletingPropertyId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/properties/${deletingPropertyId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete property');
      }
      toast.success('Property deleted successfully!');
      setRefreshKey(k => k + 1);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
      setDeletingPropertyId(null);
    }
  };

  const handleListProperty = () => {
    setEditingProperty(null);
    setIsPropertyModalOpen(true);
  };

  const handleEditProperty = (property: ListingData) => {
    setEditingProperty(property);
    setIsPropertyModalOpen(true);
  };

  const ownerName = profile?.name || dashData?.owner?.name || session?.user?.name || 'Owner';
  const stats = dashData?.stats;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col min-h-screen">
        
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
              
              <button 
                onClick={handleListProperty}
                className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-6 py-3 rounded-xl font-h2 font-bold text-body-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add_circle</span>
                <span className="hidden sm:inline">List your PG</span>
              </button>
          </div>
          
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
            <div className="bg-error-container text-on-error-container p-6 rounded-xl flex items-center gap-3 mb-stack-lg">
              <span className="material-symbols-outlined">error</span>
              <p>{error}</p>
            </div>
          )}

          {activeTab === 'overview' ? (
            <div className="space-y-stack-lg">
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
                <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container-high relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-fixed rounded-full opacity-20"></div>
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
                
                <div className="bg-primary-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all text-on-primary-container
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-primary opacity-10 rounded-tl-full"></div>
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
                
                <div className="bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-surface-container-high relative overflow-hidden group hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all
                  <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-secondary-fixed rounded-full opacity-20"></div>
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
                      className="rounded-xl p-4 shadow-[0px_4px_20px_rgba(76,29,149,0.05)] border border-outline-variant/30 flex flex-col sm:flex-row gap-4 hover:shadow-[0px_8px_30px_rgba(76,29,149,0.12)] transition-all bg-surface-container-low hover:shadow-xl"
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
                            {(() => {
                              const booleanAmenitiesList = [
                                { key: 'wifi', label: 'WiFi' },
                                { key: 'furniture', label: 'Furniture' },
                                { key: 'attachedBath', label: 'Attached Bath' },
                                { key: 'waterSupply', label: 'Water Supply' },
                                { key: 'geyser', label: 'Geyser' },
                                { key: 'backupPower', label: 'Backup Power' },
                                { key: 'cctv', label: 'CCTV' },
                                { key: 'washingMachine', label: 'Washing Machine' },
                                { key: 'petFriendly', label: 'Pet Friendly' },
                              ];
                              const activeBooleans = booleanAmenitiesList
                                .filter(a => (listing as any)[a.key])
                                .map(a => a.label);
                              const uniqueAmenities = Array.from(new Set([...(listing.amenities || []), ...activeBooleans]));
                              return uniqueAmenities.slice(0, 2).map((amenity) => (
                                <span
                                  key={amenity}
                                  className="bg-primary/5 text-primary px-2 py-1 rounded font-label-sm text-[10px] flex items-center gap-1 whitespace-nowrap"
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    {amenityIconMap[amenity] || 'check_circle'}
                                  </span>
                                  {amenity}
                                </span>
                              ));
                            })()}
                            {(() => {
                              const booleanAmenitiesList = [
                                { key: 'wifi', label: 'WiFi' },
                                { key: 'furniture', label: 'Furniture' },
                                { key: 'attachedBath', label: 'Attached Bath' },
                                { key: 'waterSupply', label: 'Water Supply' },
                                { key: 'geyser', label: 'Geyser' },
                                { key: 'backupPower', label: 'Backup Power' },
                                { key: 'cctv', label: 'CCTV' },
                                { key: 'washingMachine', label: 'Washing Machine' },
                                { key: 'petFriendly', label: 'Pet Friendly' },
                              ];
                              const activeBooleans = booleanAmenitiesList
                                .filter(a => (listing as any)[a.key])
                                .map(a => a.label);
                              const uniqueAmenities = Array.from(new Set([...(listing.amenities || []), ...activeBooleans]));
                              return uniqueAmenities.length > 2 ? (
                                <span className="bg-surface-container text-on-surface-variant px-2 py-1 rounded font-label-sm text-[10px] flex items-center whitespace-nowrap">
                                  +{uniqueAmenities.length - 2} more
                                </span>
                              ) : null;
                            })()}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <button 
                            onClick={() => handleEditProperty(listing)}
                            className="flex-1 border-[1.5px] border-primary text-primary hover:bg-primary-container/10 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-colors text-center hover:shadow-xl cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleStatusToggle(listing._id, listing.status)}
                            className="flex-1 border-[1.5px] border-outline-variant text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-lg font-label-sm text-label-sm transition-colors text-center hover:shadow-xl cursor-pointer"
                          >
                            {listing.status === 'active' ? 'Mark as Filled' : 'Mark Available'}
                          </button>
                          <button 
                            onClick={() => setDeletingPropertyId(listing._id)}
                            className="border-[1.5px] border-error/40 text-error hover:bg-error hover:text-on-error px-3 py-2 rounded-lg font-label-sm text-label-sm transition-colors text-center hover:shadow-xl cursor-pointer flex items-center justify-center"
                            title="Delete property"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
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
                      <div key={inquiry._id} className="p-4 hover:bg-surface-container-low transition-colors hover:shadow-md">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full ${color.bg} ${color.text} flex items-center justify-center font-h2 text-body-md shrink-0`}>
                            {getInitials(student?.name || 'UN')}
                          </div>
                          <div>
                            <h4 className="font-h2 text-body-md text-on-surface">{student?.name || 'Unknown Student'}</h4>
                            <p className="font-body-md text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5 mb-0.5">
                              <span className="material-symbols-outlined text-[12px]">call</span>
                              {student?.phone || 'No phone number'}
                            </p>
                            <p className="font-body-md text-label-sm text-on-surface-variant">
                              Interested in: {pg?.title || 'Unknown PG'}
                            </p>
                            <p className="font-label-sm text-[10px] text-outline mt-1">{timeAgo(inquiry.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => handleInquiryAction(inquiry._id, 'accepted')}
                            className="flex-1 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">check_circle</span> Accept
                          </button>
                          <button 
                            onClick={() => handleInquiryAction(inquiry._id, 'rejected')}
                            className="flex-1 bg-error-container/20 text-error hover:bg-error-container hover:text-on-error-container px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">cancel</span> Reject
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
          ) : (
            /* Profile Tab Layout */
            <div className="flex flex-col">
              {/* Profile Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-lg">
                {/* User Avatar & Identity Card */}
                <div className="col-span-1 md:col-span-1 bg-surface-container rounded-xl p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)] flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative mb-stack-sm w-32 h-32">
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center relative group">
                      <span className="text-on-primary font-display text-4xl">{getInitials(ownerName)}</span>
                    </div>
                  </div>
                  <h1 className="font-h1 text-h1 text-on-background mb-1">{ownerName}</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>business</span>
                    {profile?.businessName || 'Property Owner'}
                  </p>
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
                        <p className="font-body-md text-body-md text-on-surface">{profile?.email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary">call</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Phone</p>
                        <p className="font-body-md text-body-md text-on-surface">{profile?.phone || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary">badge</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Role</p>
                        <p className="font-body-md text-body-md text-on-surface capitalize">{profile?.role || 'Owner'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Business Location</p>
                        <p className="font-body-md text-body-md text-on-surface truncate">{profile?.businessAddress || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <OwnerEditProfileForm profile={profile} setProfile={setProfile} />
            </div>
          )}
        </div>
      </main>

      <PropertyModal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)} 
        property={editingProperty}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />

      {/* Delete Confirmation Modal */}
      {deletingPropertyId && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !deleteLoading && setDeletingPropertyId(null)}
          />
          <div className="relative bg-surface dark:bg-surface-container rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4 animate-[fadeScaleIn_0.2s_ease-out]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-error-container rounded-full">
                <span className="material-symbols-outlined text-error text-[28px]">warning</span>
              </div>
              <div>
                <h3 className="font-h2 text-h2 text-on-surface">Delete Property</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-body-md text-on-surface-variant">
              Are you sure you want to permanently delete this PG listing? All associated data will be removed.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingPropertyId(null)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 rounded-xl font-body-md text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 rounded-xl font-h2 font-bold bg-error text-on-error shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {deleteLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OwnerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-display text-primary text-2xl">Loading Dashboard...</div>}>
      <OwnerDashboardContent />
    </Suspense>
  );
}
