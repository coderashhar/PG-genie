'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { AuthModal } from './AuthModal';

export function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,77,64,0.06)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex justify-between items-center h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" id="nav-logo">
              {/* Stylized lamp/home icon */}
              <div className="relative w-9 h-9">
                <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
                  {/* Lamp base */}
                  <path
                    d="M18 4 L28 16 L26 18 L10 18 L8 16 Z"
                    fill="#004D40"
                    className="transition-all duration-300 group-hover:fill-[#00796B]"
                  />
                  {/* House body */}
                  <rect x="11" y="18" width="14" height="12" rx="2" fill="#004D40" opacity="0.85" />
                  {/* Door */}
                  <rect x="15" y="22" width="6" height="8" rx="1" fill="#FFC107" />
                  {/* Lamp glow */}
                  <circle cx="18" cy="8" r="2" fill="#FFC107" opacity="0.6" className="group-hover:opacity-100 transition-opacity duration-300" />
                </svg>
              </div>
              <span className="text-xl font-serif text-primary tracking-tight">
                PG Genie
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <Link
                href="/explore"
                id="nav-explore"
                className="text-sm font-medium text-on-surface hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                Explore PGs
              </Link>
              <Link
                href="/owner"
                id="nav-owner"
                className="text-sm font-medium text-on-surface hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                List Your Property
              </Link>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center">
              <button
                id="nav-login-btn"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2.5 bg-primary text-[#D0D0D0] text-sm font-medium rounded-full hover:bg-primary-dark transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,77,64,0.2)] active:scale-[0.97]"
              >
                Login / Signup
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              id="nav-mobile-toggle"
              className="md:hidden p-2 text-primary"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-8 pt-2 bg-white/95 backdrop-blur-xl border-t border-outline/30 space-y-1">
            <MobileNavLink href="/explore" label="Explore PGs" />
            <MobileNavLink href="/owner" label="List Your Property" />
            <div className="pt-4">
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileOpen(false);
                }}
                className="w-full px-6 py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition-colors"
              >
                Login / Signup
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

function MobileNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-4 py-3 text-on-surface hover:text-primary hover:bg-primary/5 rounded-xl transition-colors text-sm font-medium"
    >
      {label}
    </Link>
  );
}
