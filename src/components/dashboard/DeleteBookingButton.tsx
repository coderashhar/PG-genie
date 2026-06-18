"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function DeleteBookingButton({ bookingId }: { bookingId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteBooking = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Booking removed successfully');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to remove booking');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error transition-colors cursor-pointer group disabled:opacity-50"
      title="Remove"
      onClick={handleDeleteBooking}
      disabled={isDeleting}
    >
      <span className="material-symbols-outlined text-sm">
        {isDeleting ? 'progress_activity' : 'delete'}
      </span>
    </button>
  );
}
