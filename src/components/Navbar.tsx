"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import NotificationDropdown from "./NotificationDropdown";

function AccountMenu({ session, isHome }: { session: any, isHome?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const colorClass = isHome ? "text-white hover:opacity-80" : "text-primary dark:text-primary-fixed-dim hover:bg-primary-container/10 p-2";
  const iconSize = isHome ? "text-[28px]" : "text-[24px]";
  const imgSize = isHome ? "w-7 h-7" : "w-6 h-6";

  if (!session) {
    return (
      <Link href="/login" className={`transition-all rounded-full cursor-pointer flex items-center justify-center ${colorClass}`}>
        <span className={`material-symbols-outlined ${iconSize}`}>account_circle</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`transition-all rounded-full cursor-pointer flex items-center justify-center ${colorClass}`}
      >
        <span className={`material-symbols-outlined ${iconSize}`}>account_circle</span>
      </button>
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="absolute inset-0 pointer-events-auto" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
          <div className="absolute right-4 md:right-8 lg:right-16 top-16 w-48 bg-surface border border-surface-container rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.12)] py-2 flex flex-col text-on-surface pointer-events-auto">
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-2.5 font-body-sm text-body-sm hover:bg-surface-container transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-primary">dashboard</span> Dashboard
            </Link>
            <Link href="/dashboard?tab=profile" onClick={() => setIsOpen(false)} className="px-4 py-2.5 font-body-sm text-body-sm hover:bg-surface-container transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-primary">person</span> Profile Settings
            </Link>
            <div className="h-px bg-surface-container my-1 mx-4"></div>
            <button 
              onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }); }}
              className="px-4 py-2.5 font-body-sm text-body-sm text-error hover:bg-error/10 transition-colors flex items-center gap-3 text-left w-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span> Log out
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function Navbar({ className, hideHome }: { className?: string, hideHome?: boolean }) {
  const pathname = usePathname() || "";
  const isHome = pathname === "/";
  const { data: session } = useSession();
  const router = useRouter();

  const handleAuthRequiredClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!session) {
      e.preventDefault();
      toast.error("Please sign in or login to continue");
      router.push(`/login?callbackUrl=${encodeURIComponent(path)}`);
    }
  };

  const getActiveClass = (path: string) => {
    const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
    return isActive ? "border-b-2 border-current pb-1" : "";
  };

  if (pathname === "/login" || pathname.startsWith("/admin")) return null;

  if (isHome) {
    return (
      <nav className={`w-full z-50 transition-all duration-300 py-6 ${className || "fixed top-0 mix-blend-difference text-white"}`}>
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto">
          <span className="font-display text-[28px] font-semibold tracking-tight cursor-default">
            PG Genie
          </span>
          <div className="flex items-center gap-6">
            <NotificationDropdown isHome={true} />
            <AccountMenu session={session} isHome={true} />
          </div>
        </div>
      </nav>
    );
  }

  // Solid navbar for all other pages
  return (
    <header className="w-full sticky top-0 z-40 bg-surface dark:bg-on-background shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
        <Link href="/" className="font-display text-h2 font-extrabold text-primary dark:text-primary-fixed-dim cursor-pointer">
          PG Genie
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link className={`font-body-md text-body-md transition-colors h-16 flex items-center px-4 rounded ${getActiveClass("/") ? "text-primary dark:text-primary-fixed-dim font-bold border-b-2 border-primary" : "text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10"}`} href="/">Home</Link>
          <Link className={`font-body-md text-body-md transition-colors h-16 flex items-center px-4 rounded ${getActiveClass("/pgs") ? "text-primary dark:text-primary-fixed-dim font-bold border-b-2 border-primary" : "text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10"}`} href="/pgs">Search</Link>
          <Link className={`font-body-md text-body-md transition-colors h-16 flex items-center px-4 rounded ${getActiveClass("/dashboard") ? "text-primary dark:text-primary-fixed-dim font-bold border-b-2 border-primary" : "text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10"}`} href="/dashboard" onClick={(e) => handleAuthRequiredClick(e, "/dashboard")}>Dashboard</Link>
        </div>
        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <AccountMenu session={session} />
        </div>
      </div>
    </header>
  );
}
