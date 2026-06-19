"use client";

import React, { useState, useEffect, useRef } from 'react';
import InquiryActionButtons from './InquiryActionButtons';

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${Math.max(1, diffMins)} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays <= 7) return `${diffDays} days ago`;

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const inquiryColors = [
  { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  { bg: 'bg-primary-container', text: 'text-on-primary-container' },
];

export default function InquiriesList({ initialInquiries }: { initialInquiries: any[] }) {
  const [visibleCount, setVisibleCount] = useState(3);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 3, initialInquiries.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [initialInquiries.length]);

  if (initialInquiries.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">inbox</span>
        <p className="font-body-sm text-on-surface-variant">No inquiries yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initialInquiries.slice(0, visibleCount).map((inquiry, index) => {
        const isPending = inquiry.status === 'pending';
        const colorClass = inquiryColors[index % inquiryColors.length];
        
        return (
          <div key={inquiry._id} className={`p-4 rounded-xl border transition-all ${isPending ? 'bg-surface border-primary/20 shadow-sm' : 'bg-surface-container/50 border-transparent'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-h2 text-body-lg ${colorClass.bg} ${colorClass.text}`}>
                  {getInitials(inquiry.studentId?.name || 'Student')}
                </div>
                <div>
                  <h4 className="font-h2 text-body-md text-on-surface">{inquiry.studentId?.name || 'Student'}</h4>
                  <p className="font-label-sm text-xs text-on-surface-variant">{timeAgo(inquiry.createdAt)}</p>
                </div>
              </div>
              {!isPending && (
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-sm ${inquiry.status === 'accepted' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                  {inquiry.status}
                </span>
              )}
            </div>
            
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2">
              Interested in <span className="font-semibold text-on-surface">{inquiry.pgId?.title || 'Unknown Property'}</span>. {inquiry.message}
            </p>
            
            <div className="flex flex-col gap-2 mt-auto pt-2">
              {inquiry.status === 'pending' && (
                <InquiryActionButtons bookingId={String(inquiry._id)} />
              )}
              
              <a 
                href={inquiry.studentId?.phone ? `tel:${inquiry.studentId.phone}` : `mailto:${inquiry.studentId?.email}`}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-container font-label-sm text-label-sm text-primary hover:bg-primary-container hover:text-on-primary-container hover:font-normal transition-all cursor-pointer text-center"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {inquiry.studentId?.phone ? 'call' : 'mail'}
                </span>
                Contact Student
              </a>
            </div>
          </div>
        );
      })}
      
      {visibleCount < initialInquiries.length && (
        <div ref={observerTarget} className="h-10 flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
        </div>
      )}
    </div>
  );
}
