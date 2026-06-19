"use client";
import React, { useState } from 'react';
import PropertyModal from '@/components/PropertyModal';
import { useRouter } from 'next/navigation';

export default function EditPropertyButton({ property }: { property: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-surface-container rounded-lg text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer" 
        title="Edit Listing"
      >
        <span className="material-symbols-outlined text-[20px]">edit</span>
      </button>
      {isOpen && (
        <PropertyModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          property={property}
          onSuccess={() => {
            setIsOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
