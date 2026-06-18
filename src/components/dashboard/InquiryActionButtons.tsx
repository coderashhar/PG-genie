"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function InquiryActionButtons({ bookingId }: { bookingId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInquiryAction = async (action: 'accepted' | 'rejected') => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error(`Failed to ${action} booking`);
      toast.success(`Inquiry ${action} successfully!`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleInquiryAction('accepted')}
        disabled={isLoading}
        className="flex-1 bg-secondary text-on-secondary py-2 rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
      >
        Accept
      </button>
      <button 
        onClick={() => handleInquiryAction('rejected')}
        disabled={isLoading}
        className="flex-1 bg-surface-container border border-outline-variant py-2 rounded-lg font-label-sm text-label-sm hover:bg-error/10 hover:text-error hover:border-error transition-colors cursor-pointer disabled:opacity-50"
      >
        Decline
      </button>
    </div>
  );
}
