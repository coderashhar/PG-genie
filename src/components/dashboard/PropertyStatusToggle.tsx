"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function PropertyStatusToggle({ propertyId, initialStatus }: { propertyId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStatusToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const newStatus = status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setStatus(newStatus);
      toast.success(`Property marked as ${newStatus === 'active' ? 'Available' : 'Filled'}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleStatusToggle}
      disabled={isLoading}
      className={`font-label-sm text-label-sm px-4 py-2 rounded-full border transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 ${
        status === 'active' 
          ? 'bg-secondary/10 text-secondary border-secondary hover:bg-secondary hover:text-on-secondary' 
          : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-secondary hover:text-secondary'
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">
        {isLoading ? 'progress_activity' : (status === 'active' ? 'check_circle' : 'visibility_off')}
      </span>
      {status === 'active' ? 'Mark Filled' : 'Mark Available'}
    </button>
  );
}
