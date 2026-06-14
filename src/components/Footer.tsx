"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname.startsWith("/admin")) return null;

  return (
    <footer className="w-full bg-on-background text-surface py-20 px-margin-mobile md:px-gutter z-50 relative mt-auto">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="flex flex-col gap-6 max-w-sm">
          <div className="font-display text-4xl text-white">
            PG Genie.
          </div>
          <p className="font-body-md text-surface-variant/70 font-light">
            Elevating the standard of student living near VIT Bhopal. A digital concierge for modern accommodations.
          </p>
          <p className="font-body-md text-surface-variant/50 text-sm mt-4">
            © 2026 PG Genie. All rights reserved.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 md:gap-24">
          <div className="flex flex-col gap-4">
            <span className="font-label-sm uppercase tracking-widest text-surface-variant/40 mb-2">Platform</span>
            <Link className="font-body-md text-surface-variant hover:text-white transition-colors" href="/pgs">Curated Listings</Link>
            <Link className="font-body-md text-surface-variant hover:text-white transition-colors" href="/owner/dashboard">Owner Portal</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-label-sm uppercase tracking-widest text-surface-variant/40 mb-2">Legal &amp; Help</span>
            <Link className="font-body-md text-surface-variant hover:text-white transition-colors" href="/privacy">Privacy Policy</Link>
            <Link className="font-body-md text-surface-variant hover:text-white transition-colors" href="/terms">Terms of Service</Link>
            <Link className="font-body-md text-surface-variant hover:text-white transition-colors" href="/help">Help Center</Link>
            <Link className="font-body-md text-surface-variant hover:text-white transition-colors" href="/contact">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
