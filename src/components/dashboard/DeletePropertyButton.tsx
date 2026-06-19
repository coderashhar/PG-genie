"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

export default function DeletePropertyButton({ propertyId, propertyTitle }: { propertyId: string, propertyTitle: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (isDeleting) return;
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
      setShowConfirm(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="p-2 bg-surface-container rounded-lg text-error hover:bg-error/10 hover:border-error border border-transparent transition-all cursor-pointer disabled:opacity-50" 
        title="Delete Listing"
      >
        <span className="material-symbols-outlined text-[20px]">
          {isDeleting ? 'progress_activity' : 'delete'}
        </span>
      </button>

      {showConfirm && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => !isDeleting && setShowConfirm(false)}
          ></div>
          <div className="relative w-full max-w-sm bg-surface rounded-2xl p-6 shadow-2xl overflow-hidden text-center">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error text-3xl">delete_forever</span>
            </div>
            <h3 className="font-h2 text-xl text-on-surface mb-2">Delete Property?</h3>
            <p className="font-body-sm text-on-surface-variant mb-6">
              Are you sure you want to delete <span className="font-semibold text-on-surface">"{propertyTitle}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl font-label-md bg-surface-container hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-50 text-on-surface"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl font-label-md bg-error hover:bg-error/90 transition-colors cursor-pointer text-white disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : null}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
