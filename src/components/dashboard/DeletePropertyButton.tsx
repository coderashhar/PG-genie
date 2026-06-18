"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function DeletePropertyButton({ propertyId, propertyTitle }: { propertyId: string, propertyTitle: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (isDeleting) return;
    
    if (!window.confirm(`Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete property');
      }
      toast.success('Property deleted successfully!');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 bg-surface-container rounded-lg text-error hover:bg-error/10 hover:border-error border border-transparent transition-all cursor-pointer disabled:opacity-50" 
      title="Delete Listing"
    >
      <span className="material-symbols-outlined text-[20px]">
        {isDeleting ? 'progress_activity' : 'delete'}
      </span>
    </button>
  );
}
