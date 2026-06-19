"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface PgGalleryProps {
  images: string[];
}

export default function PgGallery({ images }: PgGalleryProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => setIsGalleryOpen(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      {/* Mobile Swipeable Gallery */}
      <section className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-2 mb-stack-md -mx-margin-mobile px-margin-mobile md:hidden h-[220px]">
        {images.map((img, idx) => (
          <div key={idx} className="relative shrink-0 w-[90%] h-full snap-center rounded-xl overflow-hidden cursor-pointer" onClick={() => openGallery(idx)}>
            <Image fill alt={`PG Image ${idx + 1}`} className="object-cover" src={img} />
            {idx === 0 && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-100"></div>
            )}
            <div className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 rounded-full text-white font-label-sm text-xs backdrop-blur-sm">
              {idx + 1} / {images.length}
            </div>
          </div>
        ))}
      </section>

      {/* Desktop Bento Grid */}
      <section className={`hidden md:grid gap-base h-[500px] rounded-xl overflow-hidden mb-stack-lg grid-cols-1 ${images.length === 1 ? 'md:grid-cols-1' : images.length === 2 ? 'md:grid-cols-2' : images.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} grid-rows-2`}>
        {images[0] && (
          <div className={`${images.length === 1 ? 'md:col-span-1 md:row-span-2' : images.length === 2 ? 'md:col-span-1 md:row-span-2' : 'md:col-span-2 md:row-span-2'} relative group cursor-pointer overflow-hidden`} onClick={() => openGallery(0)}>
            <Image fill alt="Main PG Image" className="object-cover transition-transform duration-500 group-hover:scale-105" src={images[0]} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}
        {images[1] && (
          <div className={`relative group cursor-pointer overflow-hidden ${images.length === 2 ? 'md:col-span-1 md:row-span-2' : ''}`} onClick={() => openGallery(1)}>
            <Image fill alt="PG Image 2" className="object-cover transition-transform duration-500 group-hover:scale-105" src={images[1]} />
          </div>
        )}
        {images[2] && (
          <div className={`relative group cursor-pointer overflow-hidden ${images.length === 3 ? 'md:col-span-1 md:row-span-2' : ''}`} onClick={() => openGallery(2)}>
            <Image fill alt="PG Image 3" className="object-cover transition-transform duration-500 group-hover:scale-105" src={images[2]} />
          </div>
        )}
        {images[3] && (
          <div className={`relative group cursor-pointer overflow-hidden ${images.length === 4 ? 'md:col-span-2' : ''}`} onClick={() => openGallery(3)}>
            <Image fill alt="PG Image 4" className="object-cover transition-transform duration-500 group-hover:scale-105" src={images[3]} />
          </div>
        )}
        {images[4] && (
          <div className="relative group cursor-pointer overflow-hidden" onClick={() => openGallery(4)}>
            <Image fill alt="PG Image 5" className="object-cover transition-transform duration-500 group-hover:scale-105" src={images[4]} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/50">
              <span className="text-on-primary font-h2 text-h2 flex items-center gap-2">
                <span className="material-symbols-outlined">photo_library</span> {images.length > 5 ? `+${images.length - 5} Photos` : 'View Gallery'}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" onClick={closeGallery}>
          <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-primary transition-colors cursor-pointer" onClick={closeGallery}>
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          
          <button className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors cursor-pointer" onClick={prevImage}>
            <span className="material-symbols-outlined text-5xl">chevron_left</span>
          </button>
          
          <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Image fill className="object-contain" alt={`Gallery Image ${currentImageIndex + 1}`} src={images[currentImageIndex]} />
          </div>
          
          <button className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors cursor-pointer" onClick={nextImage}>
            <span className="material-symbols-outlined text-5xl">chevron_right</span>
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white font-body-sm text-body-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
