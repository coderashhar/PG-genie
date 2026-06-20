"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function EditProfileForm({ profile }: { profile: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    batch: '',
    password: '',
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
        batch: profile.batch || '',
        password: '',
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

    // Client-side validations
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

    if (formData.batch && !/^(20|21)\d{2}$/.test(formData.batch)) {
      toast.error('Batch must be a valid 4-digit year (e.g. 2026)');
      setSaving(false);
      return;
    }

    // Only send changed fields
    const updates: Record<string, string> = {};
    if (formData.name && formData.name !== profile?.name) updates.name = formData.name;
    if (formData.email && formData.email !== profile?.email) updates.email = formData.email;
    if (phoneFull !== (profile?.phone || '')) updates.phone = phoneFull;
    if (formData.batch !== (profile?.batch || '')) updates.batch = formData.batch;

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
        router.refresh(); // Refresh Server Components to reflect changes
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

  const inputClass = "w-full bg-surface-container border border-outline-variant rounded-lg pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div className="bg-surface-container rounded-xl p-4 md:p-gutter shadow-[0px_4px_20px_rgba(76,29,149,0.05)]">
      <h2 className="font-h2 text-[20px] md:text-h2 text-on-background flex items-center gap-2 mb-4 md:mb-stack-md">
        <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]">edit</span>
        Edit Profile
      </h2>

      <form onSubmit={handleSave} className="space-y-4 md:space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
          {/* Name */}
          <div>
            <label className="block text-[11px] md:text-label-sm font-label-sm text-on-surface-variant mb-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">person</span>
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

          {/* Email */}
          <div>
            <label className="block text-[11px] md:text-label-sm font-label-sm text-on-surface-variant mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">mail</span>
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
            <label className="block text-[11px] md:text-label-sm font-label-sm text-on-surface-variant mb-1">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4 text-on-surface-variant text-[11px] md:text-body-md border-r border-outline-variant pr-2 md:pr-3">
                +91
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant rounded-lg pl-[3.2rem] md:pl-16 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="9876543210"
              />
            </div>
          </div>

          {/* Batch */}
          <div>
            <label className="block text-[11px] md:text-label-sm font-label-sm text-on-surface-variant mb-1">Batch</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">calendar_month</span>
              </span>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 2026"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto bg-primary text-on-primary hover:bg-primary/90 px-6 md:px-8 py-2 md:py-3 rounded-xl font-h2 font-bold text-sm md:text-body-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving && <span className="material-symbols-outlined animate-spin text-[16px] md:text-[18px]">progress_activity</span>}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
