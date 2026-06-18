"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function OwnerEditProfileForm({ profile }: { profile: any }) {
  const router = useRouter();
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
        router.refresh(); // Refresh Server Components
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
        <span className="material-symbols-outlined text-primary">store</span>
        Edit Business Profile
      </h2>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Owner Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your full name"
              />
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Business/PG Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">business</span>
              </span>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Sunrise Hostels"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant font-body-md border-r border-outline-variant pr-3">
                +91
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant rounded-lg pl-16 pr-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="9876543210"
              />
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Business Address</label>
          <div className="relative">
            <span className="absolute top-3 left-0 flex pl-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
            </span>
            <input
              type="text"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              className={inputClass}
              placeholder="Full office or primary PG address"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-on-primary hover:bg-primary/90 px-8 py-3 rounded-xl font-h2 font-bold text-body-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
          >
            {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
