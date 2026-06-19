"use client";
import React, { useState } from 'react';
import PropertyModal from '@/components/PropertyModal';
import { useRouter } from 'next/navigation';

export default function AddPropertyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">add_home</span>
        List Your Property
      </button>
      {isOpen && (
        <PropertyModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          onSuccess={() => {
            setIsOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
