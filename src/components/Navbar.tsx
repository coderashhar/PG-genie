"use client";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar({ className, hideHome }: { className?: string, hideHome?: boolean }) {
  const pathname = usePathname() || "";
  const isHome = pathname === "/";
  const { data: session } = useSession();
  const router = useRouter();

  const handleAuthRequiredClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!session) {
      e.preventDefault();
      toast.error("Please sign in or login to continue");
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  };

  const getActiveClass = (path: string) => {
    const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
    return isActive ? "border-b-2 border-current pb-1" : "";
  };

  if (pathname === "/login") return null;

  if (isHome) {
    return (
      <nav className={`w-full z-50 transition-all duration-300 py-6 ${className || "fixed top-0 mix-blend-difference text-white"}`}>
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto">
          <span className="font-display text-[28px] font-semibold tracking-tight cursor-default">
            PG Genie
          </span>
          <div className="flex items-center gap-6">
            <NotificationDropdown />
            <Link href="/login" onClick={(e) => handleAuthRequiredClick(e, "/login")} className="hover:opacity-70 transition-opacity cursor-pointer">
              <span className="material-symbols-outlined text-[28px]">account_circle</span>
            </Link>
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
          <Link href="/dashboard?tab=profile" onClick={(e) => handleAuthRequiredClick(e, "/dashboard?tab=profile")} className="p-2 text-primary dark:text-primary-fixed-dim hover:bg-primary-container/10 transition-colors rounded-full cursor-pointer">
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
